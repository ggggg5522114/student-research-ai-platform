import os
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_papers(topic: str, papers: list):
    papers_text = "\n\n".join([
        f"Title: {paper['title']}\n"
        f"Abstract: {paper['abstract']}\n"
        f"Authors: {', '.join(paper['authors'])}\n"
        f"Year: {paper['year']}\n"
        for paper in papers
    ])

    prompt = f"""
You are an academic research assistant.

Analyze the following papers about the topic: "{topic}"

Provide:
1. A brief summary of the topic
2. Key findings from the papers
3. Common themes
4. Research gaps
5. Suggestions for future student research

Papers:
{papers_text}
"""

    response = await client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": "You are a helpful academic research assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4
    )

    return response.choices[0].message.content
