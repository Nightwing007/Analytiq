# Analytiq — Project Plan & Implementation Specification


## Executive summary

Analytiq is a lightweight Google-Analytics-style product that captures website events via a tiny JS snippet, stores metrics in a DuckDB-backed analytics store, and exposes a React dashboard (with realtime updates) and account management features via a FastAPI backend. This document transcribes the image you provided into a thorough, structured plan: features, JSON schemas, endpoints, data flow, codebase layout, phase-by-phase milestones, deployment notes, testing, and an actionable task list for an AI agent.

---

# 1. Feature list (high level)



* Add site (register website) and generate a site-specific JS snippet.
* JS snippet that can be imported in website frontend that sends events/metrics to a backend ingestion endpoint.
* FastAPI backend to accept events, store raw events and aggregated metrics in DuckDB.
* React frontend with:

  * Landing page
  * Signup / Login
  * Manage Websites (grid of website cards)
  * Dashboard per website (charts, tables)
* Simple authentication (JWT or session).
* Live updates to open dashboards using WebSockets.


---

# 2. Architecture (textual diagram)

Monitored Website (client)
→ embeds **JS snippet** (site-id + api-key)
→ sends events to **Backend (FastAPI)** ingestion endpoints (HTTP POST /beacon or WebSocket)
Backend:

* Ingest service writes raw events to **DuckDB** (primary storage for MVP)
* Aggregator service updates computed/rolled-up metrics/timeseries (in DuckDB)
* **WebSocket broadcaster** sends live updates to any open dashboard clients
  Frontend (React):
* Manage Websites (CRUD)
* Dashboard (line charts, donut, tables) reading aggregated data and listening to WebSocket messages for live updates

---

# 3. Data model & JSON schema

Below is the **canonical JSON** format for a site's aggregated report. Use this as the API/DB schema for dashboard consumption. The raw ingestion events can be different (pageview, page-load, custom-event) and mapped to these aggregated fields by the aggregator.

### Example `site_report` JSON (aggregated)

```json
{
  "website_name": "Example Store",
  "url": "https://example.com",
  "report_generated_at": "2025-09-17T12:30:00Z",
  "date_range": "2025-09-10 to 2025-09-17",
  "total_visitors": 48239,
  "unique_visitors": 41210,
  "total_pageviews": 162845,
  "total_pages": 42,
  "avg_time_spent_on_site_sec": 186,
  "avg_loading_time_ms": 1720,
  "bounce_rate_percent": 38.4,
  "conversion_rate_percent": 3.7,
  "new_vs_returning": {
    "new_percent": 72.5,
    "returning_percent": 27.5
  },
  "traffic_sources": [
    {"source": "organic", "visitors": 21893, "percent": 45.4},
    {"source": "direct", "visitors": 10210, "percent": 21.2},
    {"source": "referral", "visitors": 7562, "percent": 15.7},
    {"source": "social", "visitors": 6574, "percent": 13.6},
    {"source": "paid", "visitors": 2000, "percent": 4.1}
  ],
  "operating_systems": [
    {"name": "Windows", "percent": 52.4},
    {"name": "MacOS", "percent": 22.8},
    {"name": "Linux", "percent": 8.3},
    {"name": "Android", "percent": 12.5},
    {"name": "iOS", "percent": 4.0}
  ],
  "browsers": [
    {"name": "Chrome", "percent": 64.2},
    {"name": "Safari", "percent": 17.9},
    {"name": "Firefox", "percent": 7.8},
    {"name": "Edge", "percent": 6.3},
    {"name": "Other", "percent": 2.0}
  ],
  "pages": [
    {
      "page_title": "Home",
      "path": "/",
      "avg_time_spent": 120,
      "pageviews": 42350
    },
    {
      "page_title": "Products",
      "path": "/products",
      "avg_time_spent": 98,
      "pageviews": 24560
    }
    // ...more pages
  ]
}
```

### Raw event (single client event) — example

```json
{
  "site_id": "site_123456",
  "timestamp": "2025-09-17T12:29:40Z",
  "event_type": "pageview", // "pageview", "load", "click", "custom"
  "path": "/products/42",
  "title": "Product 42",
  "referrer": "https://google.com",
  "user_agent": "...",
  "viewport": {"width": 1366, "height": 768},
  "performance": {"load_ms": 1720},
  "session_id": "sess_98765",
  "visitor_id": "visitor_abcd1234",
  "custom": {"cart_value": 120}
}
```

**Storage strategy:**

* Keep raw events in an append-only raw-events table (JSON/JSONL column).
* Run aggregation (hourly/daily) to compute `site_report` timeseries and summary tables used by the dashboard.

---

# 4. API design (FastAPI)

> Base URL: `https://api.analytiq.example` (use HTTPS & CORS)

### Public/Client ingestion endpoints

* `POST /ingest/event`

  * Body: raw event JSON (see Raw event).
  * Headers: `x-site-id`, `x-site-key` (or `Authorization: Bearer <token>`)
  * Behavior: validate site & key → append raw event to DuckDB (or queue) → respond 204/200 → optionally broadcast condensed update to connected websockets for `site_id`.

* `POST /ingest/bulk`

  * Bulk events array for batch ingestion.

### Site management (requires auth)

* `POST /api/signup` → create user
* `POST /api/login` → return JWT
* `GET /api/sites` → list owned sites
* `POST /api/sites` → add a site (name, url) — returns `site_id` and a `site_key`/snippet
* `DELETE /api/sites/{site_id}`
* `GET /api/sites/{site_id}` → site metadata

### Dashboard & data fetching (requires auth or site-view token)

* `GET /api/sites/{site_id}/report?from=YYYY-MM-DD&to=YYYY-MM-DD`

  * Returns the aggregated JSON (or timeseries arrays)
* `GET /api/sites/{site_id}/timeseries?metric=visitors&from=...&to=...&granularity=hour/day`
* `GET /api/sites/{site_id}/top-pages?limit=20`

### WebSocket endpoint (for live update)

* `GET /ws/sites/{site_id}?token=<dashboard_token>` -> upgrade to WebSocket

  * Accepts connections; subscribes client to `site_id`.
  * Server sends messages of shape:

```json
{
 "type": "metrics_update",
 "data": {
   "timestamp":"2025-09-17T12:31:00Z",
   "delta": {"visitors": 12, "pageviews": 20},
   "current_summary": { /* short summary */ }
 }
}
```

---

# 5. Ingestion & processing pipeline

**Flow (MVP)**

1. Client JS snippet uses `fetch` (or `navigator.sendBeacon`) to `POST /ingest/event` with event and site auth header.
2. FastAPI ingestion endpoint validates the site and appends raw event JSON as a row into `raw_events` table in DuckDB (or writes JSONL to a disk file / S3).
3. After insert, run a lightweight aggregation function (synchronously or as background task) that updates:

   * daily/hourly aggregated metrics table
   * summary record used by dashboard endpoints
4. On ingestion, broadcast a small delta message via WebSocket manager to subscribed dashboards.



---

# 6. DuckDB schema (recommended)

**Tables:**

1. `sites` (metadata)

```sql
CREATE TABLE sites (
  site_id VARCHAR PRIMARY KEY,
  owner_user_id VARCHAR,
  name VARCHAR,
  url VARCHAR,
  site_key VARCHAR, -- hashed
  created_at TIMESTAMP,
  timezone VARCHAR
);
```

2. `raw_events` (append-only)

```sql
CREATE TABLE raw_events (
  event_id UUID,
  site_id VARCHAR,
  ts TIMESTAMP,
  event_type VARCHAR,
  payload JSON,             -- full raw event JSON
  visitor_id VARCHAR,
  session_id VARCHAR
);
```

3. `aggregated_metrics_daily`

```sql
CREATE TABLE aggregated_metrics_daily (
  site_id VARCHAR,
  day DATE,
  total_visitors INTEGER,
  unique_visitors INTEGER,
  total_pageviews INTEGER,
  avg_time_spent_sec DOUBLE,
  avg_load_ms DOUBLE,
  bounce_rate DOUBLE,
  conversion_rate DOUBLE,
  traffic_sources JSON,     -- array
  os_breakdown JSON,        -- array
  browsers JSON,            -- array
  pages JSON                -- array of top pages for that day
);
```

4. `dash_summary` (fast read friendly)

```sql
CREATE TABLE dash_summary (
  site_id VARCHAR PRIMARY KEY,
  last_updated TIMESTAMP,
  current_total_visitors INTEGER,
  current_pageviews INTEGER,
  snapshot JSON
);
```

> Note: DuckDB supports JSON functions and querying Parquet/CSV/Arrow, but for portability we store some aggregates as JSON blobs for quick consumption by the dashboard. For analytics queries, prefer querying raw\_events or parquet with DuckDB's SQL.

---

# 7. Frontend (React) design & components

**Pages**

* `LandingPage` — marketing + login CTA
* `Auth` — Signup / Login forms
* `ManageWebsites` — grid of site cards; each card shows latest metrics and links to Dashboard
* `AddSiteForm` — register site, specify site name and URL, obtains `site_id` and `site_key` and the raw snippet code
* `Dashboard` — site-specific analytics with:

  * Top header (site name, timeframe selector, share dashboard button)
  * Left sidebar for navigation
  * Charts area: visitors timeseries (line), pageviews (area), top pages (bar), traffic sources (donut), browsers & OS (donut), pages table
  * Real-time indicator (green/red) and "last updated"
  * Export / download buttons

**Components**

* `Chart` (generic) — wraps desired chart lib
* `TimeRangePicker`
* `WebsocketManager` (connects to wss)
* `API` client (wraps fetch/axios with JWT)
* `SnippetView` — shows the JS snippet to copy, with built-in test button

**Chart libraries (options)**

* Recharts (easy, React-first)
* visx (Airbnb) (good performance)
* Victory (simple)
* ApexCharts or Chart.js (rich features)
* For MVP choose **Recharts** or **visx**.

**Real-time**

* Use native WebSocket or socket.io-client. For a simple implement, use native WebSocket + a small reconnection/backoff manager.

---


# 8. Client-side JS snippet (CDN-hosted, highly detailed)

**Goals:**
- The JavaScript snippet is hosted on the Analytiq server as a CDN (e.g., `https://cdn.analytiq.example/analytics.js`).
- Client websites include the snippet via a `<script src=...>` tag, passing their `site_id` and `site_key` as attributes or query params.
- The snippet collects and sends highly detailed analytics data to the server, including:
  - Page details (URL, referrer, title, path, query, hash)
  - User agent, language, timezone, screen and viewport sizes
  - Performance metrics (navigation, paint, resource timing, memory if available)
  - Session and visitor IDs (with localStorage/cookie fallback)
  - Clicks, scrolls, route changes (for SPAs), custom events
  - Consent status (if available)
  - Error events (optional)
  - All available browser details (platform, device, etc.)
- Uses `navigator.sendBeacon` where possible, falls back to `fetch` with `keepalive`.
- Privacy-aware: does not collect PII by default, but can be extended for custom events.

**How to use:**

```html
<!-- AnalytIQ CDN snippet: place in <head> or before </body> -->
<script src="https://cdn.analytiq.example/analytics.js" data-site-id="site_123456" data-site-key="pk_live_XYZ" async defer></script>
```

**Example: Highly detailed analytics.js (hosted on Analytiq CDN)**

```javascript
(function(){
  // Get site credentials from script tag
  var script = document.currentScript || (function(){
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length-1];
  })();
  var SITE_ID = script.getAttribute('data-site-id');
  var SITE_KEY = script.getAttribute('data-site-key');
  var ENDPOINT = "https://api.analytiq.example/ingest/event";

  // Generate or retrieve visitor/session IDs
  function getId(key, gen) {
    try {
      var v = localStorage.getItem(key);
      if (!v) {
        v = gen();
        localStorage.setItem(key, v);
      }
      return v;
    } catch(e) {
      return gen();
    }
  }
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c=='x'?r:(r&0x3|0x8);
      return v.toString(16);
    });
  }
  var visitor_id = getId('analytiq_visitor_id', uuidv4);
  var session_id = getId('analytiq_session_id', uuidv4);

  // Collect detailed data
  function collectData(eventType, extra) {
    var nav = window.performance && performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : {};
    var paint = window.performance && performance.getEntriesByType ? performance.getEntriesByType('paint') : [];
    var mem = window.performance && performance.memory ? performance.memory : {};
    var timing = window.performance && performance.timing ? performance.timing : {};
    var data = {
      site_id: SITE_ID,
      site_key: SITE_KEY,
      timestamp: (new Date()).toISOString(),
      event_type: eventType || "pageview",
      url: window.location.href,
      path: window.location.pathname,
      query: window.location.search,
      hash: window.location.hash,
      title: document.title,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {width: screen.width, height: screen.height, availWidth: screen.availWidth, availHeight: screen.availHeight, pixelDepth: screen.pixelDepth},
      viewport: {width: window.innerWidth, height: window.innerHeight},
      platform: navigator.platform,
      device_memory: navigator.deviceMemory,
      hardware_concurrency: navigator.hardwareConcurrency,
      cookies_enabled: navigator.cookieEnabled,
      do_not_track: navigator.doNotTrack,
      performance: {
        nav: nav,
        paint: paint,
        memory: mem,
        timing: timing
      },
      visitor_id: visitor_id,
      session_id: session_id,
      consent: window.__analytiq_consent || null,
      ...extra
    };
    return data;
  }

  // Send data to server
  function send(data) {
    var body = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT + "?site_id=" + encodeURIComponent(SITE_ID) + "&k=" + encodeURIComponent(SITE_KEY), body);
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
          "x-site-id": SITE_ID,
          "x-site-key": SITE_KEY
        },
        keepalive: true
      }).catch(function(){});
    }
  }

  // Initial pageview
  send(collectData("pageview"));

  // SPA route changes (pushState/popstate/hashchange)
  var lastUrl = window.location.href;
  setInterval(function(){
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      send(collectData("route_change"));
    }
  }, 500);

  // Click tracking
  document.addEventListener("click", function(e){
    var t = e.target;
    send(collectData("click", {
      click: {
        tag: t.tagName,
        id: t.id,
        class: t.className,
        text: t.innerText && t.innerText.slice(0,64),
        x: e.clientX,
        y: e.clientY
      }
    }));
  }, true);

  // Scroll tracking (throttled)
  var lastScroll = 0;
  window.addEventListener("scroll", function(){
    var now = Date.now();
    if (now - lastScroll > 1000) {
      lastScroll = now;
      send(collectData("scroll", {
        scroll: {
          x: window.scrollX,
          y: window.scrollY,
          maxY: document.body.scrollHeight
        }
      }));
    }
  });

  // Error tracking (optional)
  window.addEventListener("error", function(e){
    send(collectData("error", {
      error: {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      }
    }));
  });

  // Custom event API
  window.analytiq = window.analytiq || {};
  window.analytiq.track = function(eventType, extra) {
    send(collectData(eventType, extra));
  };
})();
```

**Snippet generation:** When a site is created, server returns `site_id` and `site_key`. The UI instructs the user to embed the CDN snippet with their credentials as attributes. The actual analytics.js is hosted and versioned on the Analytiq CDN, and can be updated centrally for all clients.

---

# 9. Security, privacy & compliance

* **Auth:** JWT for API; per-site API key for the snippet (rotateable).
* **Rate limiting** on ingestion endpoints.
* **CORS** policies that allow only known dashboards to read API.
* **IP anonymization** / do not store raw IPs unless strictly necessary.
* **PII policy:** Do not collect sensitive PII by default (e.g., names, emails) — if custom events include PII, warn/strip server-side.
* **Consent:** Provide cookie/consent banner and opt-out mechanism.
* **Storage encryption**: encrypt disk at rest or at least protect backups.
* **Keys:** store secret keys in environment variables (not in repo).

---

# 10. Dev & codebase architecture (file tree + responsibilities)

```
/analytiq
├─ backend/
│  ├─ app/
│  │  ├─ main.py               # FastAPI app and routers
│  │  ├─ api/
│  │  │  ├─ ingest.py          # /ingest/event endpoints
│  │  │  ├─ auth.py            # signup/login
│  │  │  └─ sites.py           # site management APIs
│  │  ├─ models.py             # pydantic schemas
│  │  ├─ db.py                 # DuckDB connection wrapper & helpers
│  │  ├─ aggregator.py         # aggregation logic
│  │  ├─ ws_manager.py         # WebSocket connection manager & broadcaster
│  │  ├─ auth_utils.py         # JWT utilities
│  │  └─ tasks.py              # background tasks (asyncio or RQ/Celery)
│  ├─ Dockerfile
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ pages/{Landing,Auth,Manage,Dash} 
│  │  ├─ components/{Chart,API,WebsocketManager,SnippetView}
│  │  └─ App.jsx
│  ├─ Dockerfile
│  └─ package.json
└─ README.md
```

**Key backend modules explained**

* `db.py`: encapsulate DuckDB init, path management (like `DATA_DIR/analytiq.db`) and helpers to append JSON rows and run SQL.
* `ingest.py`: validates `x-site-key`, writes raw\_events (prefer append then background aggregate).
* `aggregator.py`: queries raw\_events to compute daily/hourly aggregates and writes to aggregated tables.
* `ws_manager.py`: holds in-memory map of `site_id -> [websocket_connections]` to broadcast deltas.

---

# 11. Background jobs & worker choices

* **Simple MVP:** use FastAPI background tasks (Starlette `BackgroundTasks`) — OK for low traffic.

---

# 12. Deployment & infra suggestions

**MVP**: single Docker Compose stack:

* `api` (FastAPI + uvicorn)
* `frontend` (static build served)
* persistent volume for `duckdb` file



---



# 15. Acceptance criteria (per phase)

**Phase 0 (MVP minimum features) — acceptance**

* Able to create an account and add a site; system generates a site id & snippet.
* Snippet posted on any site results in POSTs arriving at `POST /ingest/event` and a raw\_events row in DuckDB.
* Dashboard page for site renders with at least visitors timeseries and top pages (stub data OK).
* Websocket connection to `/ws/sites/{site_id}` returns updates when ingestion happens (delta pushed).

**Phase 1 (polished) — acceptance**

* Auth works (signup/login with JWT).
* Manage Websites page lists all user sites; clicking a site shows the dashboard with real aggregated data across a selectable date-range.
* Desktop and mobile responsive layout; snippet copy UI.
* Basic rate limiting and API key rotation implemented.


---

# 16. Phase-by-phase plan (what to implement, in order)

**Phase A (MVP core)**

* Setup monorepo with backend & frontend.
* Implement DuckDB wrapper and `sites` + `raw_events` tables.
* Build `POST /ingest/event` endpoint (auth by `x-site-key`).
* Build simple aggregator (background task) to compute daily summaries.
* React: simple dashboard showing summary + line chart; implement WebSocket client.
* Implement JS snippet generator UI.

**Phase B (auth & management)**

* Signup/login endpoints & UI.
* `Manage Websites` page & create/delete site flows.
* Secure snippet keys and provide rotate endpoint.
* Implement simple rate-limiting and basic unit tests.



---

# 17. Example integration snippets (FastAPI & DuckDB) — sketch

**FastAPI ingestion route pseudocode**

```python
from fastapi import FastAPI, Request, Header, HTTPException, BackgroundTasks
from app.db import append_raw_event, ensure_db

app = FastAPI()

@app.post("/ingest/event")
async def ingest_event(request: Request, x_site_id: str = Header(None), x_site_key: str = Header(None), background_tasks: BackgroundTasks = None):
    body = await request.json()
    # validate site & key (db lookup) -> raise 403 if invalid
    # store raw event
    append_raw_event(site_id=x_site_id, ts=body.get("timestamp"), payload=body, visitor_id=body.get("visitor_id"))
    # asynchronous small aggregator or broadcast
    background_tasks.add_task(process_short_aggregation, x_site_id)
    return {"status": "ok"}
```

**DuckDB append helper (concept)**

```python
import duckdb, json, os
db_path = os.getenv("DUCKDB_PATH", "/data/analytiq.db")
con = duckdb.connect(db_path)

def append_raw_event(site_id, ts, payload, visitor_id):
    payload_json = json.dumps(payload)
    con.execute("""
      INSERT INTO raw_events (event_id, site_id, ts, payload, visitor_id, session_id)
      VALUES (uuid(), ?, ?, ?, ?, ?)
    """, [site_id, ts, payload_json, visitor_id, payload.get("session_id")])
```

> These are sketches — use prepared statements and concurrency-safe patterns in production.

---

# 18. AI-agent-ready checklist (tasks & sub-tasks)

This is a machine-actionable checklist you can feed to an AI builder (ordered and structured).

**Repo & basic infra**

1. Create monorepo skeleton (`backend/`, `frontend/`).
2. Create `README.md` with start instructions.

**Backend**

1. Install FastAPI, uvicorn, duckdb, pydantic.
2. Implement `db.py` (DuckDB init, create tables if not exist).
3. Implement `models.py` (pydantic schemas for raw event and aggregated report).
4. Implement `ingest` router with `/ingest/event` and input validation.
5. Implement `sites` router for add/list/delete site.
6. Implement `auth` router for signup/login (JWT).
7. Implement `ws_manager` with subscribe/unsubscribe and broadcast utilities.
8. Implement `aggregator` job that computes daily rollups from `raw_events`.

**Frontend**

1. Create React app (Vite or CRA) with Tailwind (optional).
2. Implement `Landing`, `Auth`, `ManageSites`, `Dashboard`.
3. Implement charts using Recharts.
4. Implement `SnippetView`.
5. Implement websocket manager and update UI on messages.


---

# 19. Non-functional concerns & recommendations

* **Locking & concurrency:** DuckDB supports concurrent reads with a single writer; for heavy ingestion use batching or external queue to avoid write contention.
* **Data retention & cost:** Keep raw events for a configurable retention (e.g., 30 days); keep aggregated summaries longer.

---

# 20. Final notes / guidance for the AI agent

* Use the JSON examples in section 3 as the canonical interchange format between ingestion, aggregation, and dashboard.
* Prioritize correctness and small footprint: keep snippet < 1KB and ensure it does not block page load.
* For MVP, favor simplicity: synchronous write to DuckDB file on disk plus immediate small aggregator background task is acceptable. Later, switch to queue + worker.

---

