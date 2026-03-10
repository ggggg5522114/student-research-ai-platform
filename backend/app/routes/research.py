from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scholar_service import search_papers
from app.services.openai_service import analyze_papers

router = APIRouter()

class ResearchRequest(BaseModel):
    topic: str

@router.post("/research/analyze")
async def analyze_research(request: ResearchRequest):
    try:
        papers = await search_papers(request.topic)

        if not papers:
            raise HTTPException(status_code=404, detail="No papers found")

        analysis = await analyze_papers(request.topic, papers)

        return {
            "topic": request.topic,
            "papers": papers,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
