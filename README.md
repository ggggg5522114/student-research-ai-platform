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
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
