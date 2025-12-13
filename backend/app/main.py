from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import hackathons
from app.services.appwrite import get_db_service # <--- NEW IMPORT
from app.api.routes import hackathons, auth, users, teams
app = FastAPI(title=settings.PROJECT_NAME)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    status = "Checking..."
    try:
        # CORRECT METHOD: list_documents (Plural)
        get_db_service().list_documents(
            database_id=settings.APPWRITE_DATABASE_ID, 
            collection_id=settings.COLLECTION_HACKATHONS
        )
        status = "✅ Connected to Appwrite"
    except Exception as e:
        status = f"❌ Connection Failed: {str(e)}"

    return {
        "status": status,
        "docs": "http://localhost:8000/docs"
    }

# Register Routes
app.include_router(hackathons.router, prefix="/api/hackathons", tags=["Hackathons"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])