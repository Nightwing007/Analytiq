from fastapi import APIRouter, HTTPException
from app.ai.models import MetricChatRequest, AIResponse
from app.ai.services.llm_client import llm_client
from app.ai.services.prompts import METRIC_ANALYSIS_PROMPT
from app.db import con

router = APIRouter()

@router.post("/chat/metric", response_model=AIResponse)
async def chat_metric(request: MetricChatRequest):
    try:
        # 1. Fetch Metric Data
        # Simplified fetching logic. In production, we'd map 'metric' to specific SQL queries.
        
        # For now, we will just fetch a count of events that might match the metric name vaguely
        # or just pass the responsibility to the AI to interpret "no data" if we can't find it.
        # But let's try to get *something* generic.
        
        metric_data = "Data retrieval for specific metrics is not yet fully implemented in DB layer."
        
        if request.metric == "page_views":
             res = con.execute("""
                SELECT count(*) FROM raw_events 
                WHERE site_id = ? AND event_type = 'page_view'
                AND ts > now() - INTERVAL 7 DAY
             """, [request.website_id]).fetchone()
             metric_data = f"Page Views (Last 7 Days): {res[0]}"
             
        elif request.metric == "clicks":
             res = con.execute("""
                SELECT count(*) FROM raw_events 
                WHERE site_id = ? AND event_type = 'click'
                AND ts > now() - INTERVAL 7 DAY
             """, [request.website_id]).fetchone()
             metric_data = f"Clicks (Last 7 Days): {res[0]}"

        # 2. Build System Prompt
        system_prompt = METRIC_ANALYSIS_PROMPT.format(
            metric=request.metric,
            website_id=request.website_id,
            page=request.page or "All",
            metric_data=metric_data,
            user_query=request.message
        )
        
        # 3. Call LLM
        response = llm_client.get_analysis(system_prompt, request.message)
        return response

    except Exception as e:
        print(f"Error in metric chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
