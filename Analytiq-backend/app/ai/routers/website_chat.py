from fastapi import APIRouter, HTTPException
from app.ai.models import WebsiteChatRequest, AIResponse
from app.ai.services.llm_client import llm_client
from app.ai.services.rag_service import rag_service
from app.ai.services.prompts import WEBSITE_ANALYSIS_PROMPT
from app.db import con

router = APIRouter()

@router.post("/chat/website", response_model=AIResponse)
async def chat_website(request: WebsiteChatRequest):
    # 1. Fetch Aggregated Metrics for the website
    # We'll do a simple query to get some basic stats to feed the AI
    # In a real scenario, we might call aggregator functions
    
    try:
        # Example: Fetch last 7 days metrics summary
        # This is a simplification. We'd likely want specific aggregator tables.
        # Checking if tables exist first to avoid errors if migrations haven't run perfectly (defensive)
        
        # Fetch basic site info
        site = con.execute("SELECT * FROM sites WHERE site_id = ?", [request.website_id]).fetchone()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")

        # Fetch some raw stats (count of events in last 24h)
        # We use a simple query here.
        stats = con.execute("""
            SELECT 
                count(*) as total_events,
                count(distinct session_id) as total_sessions,
                count(distinct visitor_id) as total_visitors
            FROM raw_events 
            WHERE site_id = ? 
            AND ts > now() - INTERVAL 7 DAY
        """, [request.website_id]).fetchone()
        
        metrics_summary = f"""
        Time Range: Last 7 Days
        Total Events: {stats[0]}
        Total Sessions: {stats[1]}
        Total Visitors: {stats[2]}
        """
        
        # 2. Retrieve RAG Context
        seo_context = rag_service.retrieve_context(request.message)
        
        # 3. Build System Prompt
        system_prompt = WEBSITE_ANALYSIS_PROMPT.format(
            website_id=request.website_id,
            metrics_summary=metrics_summary,
            recent_insights="None",
            seo_context=seo_context,
            user_query=request.message
        )
        
        # 4. Call LLM
        response = llm_client.get_analysis(system_prompt, request.message)
        return response

    except Exception as e:
        print(f"Error in website chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
