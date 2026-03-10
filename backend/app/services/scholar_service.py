import os
import httpx

SEMANTIC_SCHOLAR_BASE_URL = os.getenv(
    "SEMANTIC_SCHOLAR_BASE_URL",
    "https://api.semanticscholar.org/graph/v1"
)

async def search_papers(topic: str):
    url = f"{SEMANTIC_SCHOLAR_BASE_URL}/paper/search"
    params = {
        "query": topic,
        "limit": 5,
        "fields": "title,abstract,authors,year,url"
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    papers = []
    for item in data.get("data", []):
        papers.append({
            "title": item.get("title"),
            "abstract": item.get("abstract"),
            "authors": [author.get("name") for author in item.get("authors", [])],
            "year": item.get("year"),
            "url": item.get("url")
        })

    return papers
