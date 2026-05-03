from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Legacy Logic Studio API",
    description="Backend API for Legacy Logic Studio - Business Logic Time Machine",
    version="0.1.0"
)

# CORS configuration for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Legacy Logic Studio API",
        "version": "0.1.0",
        "docs": "/docs"
    }

# Made with Bob
