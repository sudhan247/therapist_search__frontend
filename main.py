from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import httpx

app = FastAPI(
    title="Therapist Search Frontend",
    description="Frontend interface for therapist search application",
    version="1.0.0"
)

# Enable CORS for API calls to production backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    """Serve the main HTML page"""
    return FileResponse("static/index.html")

@app.get("/style.css")
async def get_style():
    """Serve the CSS file"""
    return FileResponse("static/style.css")

@app.get("/script.js") 
async def get_script():
    """Serve the JS file"""
    return FileResponse("static/script.js")

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {
        "status": "healthy",
        "message": "Therapist Search Frontend is running",
        "version": "1.0.0"
    }

@app.get("/api/stats")
async def get_stats():
    """Fetch stats from backend API including total profiles count"""
    backend_url = "https://therapistsearch-production.up.railway.app"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{backend_url}/health", timeout=10.0)
            response.raise_for_status()
            backend_data = response.json()
            
            return {
                "status": "success",
                "total_profiles": backend_data.get("total_vectors", 0),
                "backend_healthy": backend_data.get("status") == "healthy",
                "index_name": backend_data.get("index_name", "therapist-search")
            }
    except Exception as e:
        raise HTTPException(
            status_code=503, 
            detail=f"Unable to fetch stats from backend: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)