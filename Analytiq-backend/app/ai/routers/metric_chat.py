



from fastapi import APIRouter, HTTPException
from app.ai.models import MetricChatRequest, AIResponse
from app.ai.services.llm_client import llm_client
from app.ai.services.prompts import METRIC_ANALYSIS_PROMPT
from app.ai.services.rag_service import rag_service
from app.db import con

router = APIRouter()

def fetch_metric_data(website_id, metric, page=None):
    # Expand this as needed for more metrics
    try:
        if metric == "page_views":
            if page:
                res = con.execute(
                    """
                    SELECT count(*) FROM raw_events 
                    WHERE site_id = ? AND event_type = 'page_view' AND page = ?
                    AND ts > now() - INTERVAL 7 DAY
                    """, [website_id, page]).fetchone()
                return f"Page Views for {page} (Last 7 Days): {res[0]}"
            else:
                res = con.execute(
                    """
                    SELECT count(*) FROM raw_events 
                    WHERE site_id = ? AND event_type = 'page_view'
                    AND ts > now() - INTERVAL 7 DAY
                    """, [website_id]).fetchone()
                return f"Page Views (Last 7 Days): {res[0]}"
        elif metric == "clicks":
            if page:
                res = con.execute(
                    """
                    SELECT count(*) FROM raw_events 
                    WHERE site_id = ? AND event_type = 'click' AND page = ?
                    AND ts > now() - INTERVAL 7 DAY
                    """, [website_id, page]).fetchone()
                return f"Clicks for {page} (Last 7 Days): {res[0]}"
            else:
                res = con.execute(
                    """
                    SELECT count(*) FROM raw_events 
                    WHERE site_id = ? AND event_type = 'click'
                    AND ts > now() - INTERVAL 7 DAY
                    """, [website_id]).fetchone()
                return f"Clicks (Last 7 Days): {res[0]}"
        elif metric == "scroll_depth":
            if page:
                res = con.execute(
                    """
                    SELECT avg(event_data->>'scroll_depth') FROM raw_events 
                    WHERE site_id = ? AND event_type = 'scroll' AND page = ?
                    AND ts > now() - INTERVAL 7 DAY
                    """, [website_id, page]).fetchone()
                return f"Avg Scroll Depth for {page} (Last 7 Days): {res[0] or 'N/A'}"
            else:
                res = con.execute(
                    """
                    SELECT avg(event_data->>'scroll_depth') FROM raw_events 
                    WHERE site_id = ? AND event_type = 'scroll'
                    AND ts > now() - INTERVAL 7 DAY
                    """, [website_id]).fetchone()
                return f"Avg Scroll Depth (Last 7 Days): {res[0] or 'N/A'}"
        elif metric == "bounce_rate":
            # Example: Use aggregated table if available
            res = con.execute(
                """
                SELECT avg(bounce_rate) FROM page_metrics
                WHERE website_id = ?
                AND date > current_date - INTERVAL 7 DAY
                """, [website_id]).fetchone()
            return f"Avg Bounce Rate (Last 7 Days): {res[0] or 'N/A'}"
        # Add more metrics as needed
        return "Metric not recognized or not implemented."
    except Exception as e:
        return f"Error fetching metric data: {e}"

@router.post("/chat/metric", response_model=AIResponse)
async def chat_metric(request: MetricChatRequest):
    try:
        # 1. Fetch Metric Data
        metric_data = fetch_metric_data(request.website_id, request.metric, request.page)

        # 2. Retrieve RAG Context (SEO, summaries)
        rag_context = rag_service.retrieve_context(request.message)

        # 3. Build System Prompt
        system_prompt = METRIC_ANALYSIS_PROMPT.format(
            metric=request.metric,
            website_id=request.website_id,
            page=request.page or "All",
            metric_data=metric_data + "\n\nRelevant SEO/AI Context:\n" + rag_context,
            user_query=request.message
        )

        # 4. Call LLM
        response = llm_client.get_analysis(system_prompt, request.message)
        return response

    except Exception as e:
        print(f"Error in metric chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
