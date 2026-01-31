from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, ingest, sites
from app.db import init_db, migrate_db
import os
from dotenv import load_dotenv
from app.cors_static import CORSEnabledStaticFiles
load_dotenv()

app = FastAPI()

# Load environment variables
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# ------------------------
# CORS Configuration
# ------------------------
# Custom middleware to handle different CORS policies for different routes
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    # Handle preflight OPTIONS requests
    if request.method == "OPTIONS":
        # Open CORS for ingest endpoints (client SDK)
        if request.url.path.startswith("/ingest/"):
            return Response(
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, x-site-id, x-site-key, Authorization",
                    "Access-Control-Max-Age": "86400",
                },
            )
        # Strict CORS for dashboard API endpoints
        elif request.url.path.startswith("/api/"):
            return Response(
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": FRONTEND_URL,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Max-Age": "86400",
                },
            )
    
    response = await call_next(request)
    
    # Add CORS headers to actual requests
    # Open CORS for ingest endpoints (client SDK sends events from any site)
    if request.url.path.startswith("/ingest/"):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, x-site-id, x-site-key, Authorization"
    # Strict CORS for dashboard API endpoints (only localhost:3000)
    elif request.url.path.startswith("/api/"):
        response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    
    return response

# ------------------------
# Startup
# ------------------------
@app.on_event("startup")
def startup_event():
    init_db()
    migrate_db()  # Run migrations to add last_updated column if needed

# ------------------------
# Routers
# ------------------------
app.include_router(auth.router, prefix="/api")
app.include_router(ingest.router, prefix="/ingest")
app.include_router(sites.router, prefix="/api")

# ------------------------
# Client-Side SDK (OPEN CORS)
# ------------------------

@app.options("/stats-config.js")
def client_sdk_preflight():
    return Response(
        status_code=204,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400",
        },
    )

@app.get("/stats-config.js")
def serve_client_sdk(request: Request, siteId: str = None, siteKey: str = None):
    backend_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")

    js_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "client-side-sdk.js"
    )

    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    # Inject site configuration if provided via query parameters
    if siteId and siteKey:
        # Inject config before the main loader script
        config_injection = f'''window.analytiqSiteId = "{siteId}";
  window.analytiqSiteKey = "{siteKey}";'''
        # Insert config right after the opening IIFE
        js_content = js_content.replace(
            "(function() {\n  'use strict';",
            f"(function() {{\n  'use strict';\n\n  // Injected site configuration\n  {config_injection}\n"
        )

    return Response(
        content=js_content,
        media_type="application/javascript",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

# ------------------------
# Test Page
# ------------------------
@app.get("/test")
def serve_test_page():
    test_html_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "test-sdk.html"
    )

    with open(test_html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    return Response(content=html_content, media_type="text/html")

# ------------------------
# Static Client-Side SDK
# ------------------------
client_sdk_path = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "client-side-sdk"
)
app.mount(
    "/client-side-sdk",
    CORSEnabledStaticFiles(directory=client_sdk_path),
    name="client-side-sdk",
)


