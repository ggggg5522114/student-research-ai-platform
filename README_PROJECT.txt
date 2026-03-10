# =========================================================
# Student Research AI Platform
# ملف واحد يحتوي شرح المشروع + جميع الأكواد الأساسية
# =========================================================

# ---------------------------------------------------------
# 1) فكرة المشروع
# ---------------------------------------------------------
منصة لتحليل الأبحاث الطلابية باستخدام OpenAI
مع جلب الأوراق العلمية من Semantic Scholar
ويمكن لاحقًا دعم Google Scholar عبر SerpAPI.

المزايا:
- البحث عن أوراق علمية حسب الموضوع
- تلخيص النتائج
- استخراج أهم النقاط
- تحديد الفجوات البحثية
- اقتراح أفكار لأبحاث مستقبلية

التقنيات:
- Frontend: Next.js
- Backend: FastAPI
- AI: OpenAI API
- Research Source: Semantic Scholar API

# ---------------------------------------------------------
# 2) هيكل المشروع
# ---------------------------------------------------------
student-research-ai-platform/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   └── research.py
│   │   └── services/
│   │       ├── openai_service.py
│   │       └── scholar_service.py
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md


# ---------------------------------------------------------
# 3) ملف README.md
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل README.md

# Student Research AI Platform

منصة لتحليل الأبحاث الطلابية باستخدام OpenAI مع جلب الأوراق العلمية من Semantic Scholar، ويمكن لاحقًا دعم Google Scholar عبر SerpAPI.

## Features
- البحث عن أوراق علمية حسب الموضوع
- تلخيص النتائج
- استخراج أهم النقاط
- تحديد الفجوات البحثية
- اقتراح أفكار لأبحاث مستقبلية

## Tech Stack
- Frontend: Next.js
- Backend: FastAPI
- AI: OpenAI API
- Research Source: Semantic Scholar API

## Run Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

## Run Frontend
cd frontend
npm install
npm run dev


# ---------------------------------------------------------
# 4) ملف .gitignore
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل .gitignore

# Python
__pycache__/
*.pyc
venv/
.env

# Node
node_modules/
.next/
out/

# OS
.DS_Store


# ---------------------------------------------------------
# 5) ملف backend/requirements.txt
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل backend/requirements.txt

fastapi
uvicorn
httpx
python-dotenv
openai
pydantic


# ---------------------------------------------------------
# 6) ملف backend/.env.example
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل backend/.env.example

OPENAI_API_KEY=your_openai_api_key
SEMANTIC_SCHOLAR_BASE_URL=https://api.semanticscholar.org/graph/v1


# ---------------------------------------------------------
# 7) ملف backend/app/main.py
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.research import router as research_router

app = FastAPI(title="Student Research AI Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(research_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend is running"}


# ---------------------------------------------------------
# 8) ملف backend/app/routes/research.py
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل backend/app/routes/research.py

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


# ---------------------------------------------------------
# 9) ملف backend/app/services/scholar_service.py
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل backend/app/services/scholar_service.py

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


# ---------------------------------------------------------
# 10) ملف backend/app/services/openai_service.py
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل backend/app/services/openai_service.py

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


# ---------------------------------------------------------
# 11) ملف frontend/package.json
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل frontend/package.json

{
  "name": "student-research-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "@types/node": "^20.12.7",
    "@types/react": "^18.2.79",
    "@types/react-dom": "^18.2.25"
  }
}


# ---------------------------------------------------------
# 12) ملف frontend/tsconfig.json
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل frontend/tsconfig.json

{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}


# ---------------------------------------------------------
# 13) ملف frontend/next.config.js
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;


# ---------------------------------------------------------
# 14) ملف frontend/app/layout.tsx
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل frontend/app/layout.tsx

export const metadata = {
  title: "Student Research AI Platform",
  description: "Analyze student research using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}


# ---------------------------------------------------------
# 15) ملف frontend/app/page.tsx
# ---------------------------------------------------------
# انسخ هذا المحتوى داخل frontend/app/page.tsx

"use client";

import { useState } from "react";

type Paper = {
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  url: string;
};

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);

  const handleAnalyze = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setAnalysis("");
    setPapers([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/research/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic })
      });

      const data = await res.json();

      setAnalysis(data.analysis || "");
      setPapers(data.papers || []);
    } catch (error) {
      setAnalysis("حدث خطأ أثناء التحليل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>منصة تحليل البحث الطلابي</h1>
      <p>أدخل موضوع البحث ليتم جلب الأوراق العلمية وتحليلها بالذكاء الاصطناعي.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="مثال: Artificial Intelligence in Education"
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          {loading ? "جاري التحليل..." : "تحليل"}
        </button>
      </div>

      {papers.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2>الأوراق العلمية</h2>
          {papers.map((paper, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 10,
                marginBottom: 12
              }}
            >
              <h3>{paper.title}</h3>
              <p><strong>السنة:</strong> {paper.year}</p>
              <p><strong>المؤلفون:</strong> {paper.authors.join(", ")}</p>
              <p>{paper.abstract}</p>
              {paper.url && (
                <a href={paper.url} target="_blank" rel="noreferrer">
                  عرض البحث
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {analysis && (
        <section>
          <h2>تحليل الذكاء الاصطناعي</h2>
          <div
            style={{
              whiteSpace: "pre-wrap",
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 10
            }}
          >
            {analysis}
          </div>
        </section>
      )}
    </main>
  );
}


# ---------------------------------------------------------
# 16) أوامر إنشاء المشروع
# ---------------------------------------------------------
# نفذ هذه الأوامر في الطرفية Terminal

mkdir student-research-ai-platform
cd student-research-ai-platform
mkdir -p backend/app/routes backend/app/services frontend/app


# ---------------------------------------------------------
# 17) تشغيل الباك إند
# ---------------------------------------------------------
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload


# ---------------------------------------------------------
# 18) تشغيل الفرونت إند
# ---------------------------------------------------------
cd frontend
npm install
npm run dev


# ---------------------------------------------------------
# 19) رفع المشروع إلى GitHub
# ---------------------------------------------------------
git init
git add .
git commit -m "Initial MVP for student research AI platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-research-ai-platform.git
git push -u origin main


# ---------------------------------------------------------
# 20) المرحلة القادمة
# ---------------------------------------------------------
بعد تشغيل النسخة الأولى يمكن إضافة:
- تسجيل دخول للمستخدمين
- حفظ نتائج التحليل في قاعدة بيانات
- رفع PDF
- دعم Google Scholar عبر SerpAPI
- إنشاء Literature Review تلقائي
- تصدير النتائج إلى PDF أو Word

# =========================================================
# نهاية الملف
# =========================================================
