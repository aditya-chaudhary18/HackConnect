from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import hackathons  # Import the new routes

app = FastAPI(title=settings.PROJECT_NAME)

# Base route to check if server is running
@app.get("/")
def read_root():
    return {
        "status": "online", 
        "project": settings.PROJECT_NAME,
        "docs_url": "http://localhost:8000/docs"
    }

# Register the Hackathon routes
# This creates URLs like: http://localhost:8000/api/hackathons
app.include_router(hackathons.router, prefix="/api/hackathons", tags=["Hackathons"])