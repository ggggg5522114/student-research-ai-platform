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
