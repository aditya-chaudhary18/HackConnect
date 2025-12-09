from fastapi import APIRouter, HTTPException
from typing import List
from app.services.appwrite import get_db_service
from app.core.config import settings
from app.models.hackathon import HackathonCreate
from appwrite.id import ID
from appwrite.query import Query

router = APIRouter()

# --- EXISTING ROUTES ---

@router.post("/", summary="Create a new Hackathon")
def create_hackathon(hackathon: HackathonCreate):
    try:
        db = get_db_service()
        result = db.create_document(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS,
            document_id=ID.unique(),
            data=hackathon.dict()
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", summary="Get all Hackathons")
def get_hackathons():
    try:
        db = get_db_service()
        result = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS
        )
        return {"success": True, "documents": result['documents']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- NEW: RECOMMENDATION ENGINE (PHASE 2) ---

@router.post("/recommendations", summary="Get personalized hackathons")
def get_recommendations(user_tags: List[str]):
    """
    Input: ["AI", "Python"]
    Output: Hackathons that match those tags.
    """
    try:
        db = get_db_service()
        
        # 1. Get all hackathons
        # (In a real production app, we would use Appwrite Queries, 
        # but filtering in Python is easier for now without setting up Indexes)
        all_docs = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS
        )
        
        documents = all_docs['documents']
        matches = []

        # 2. Simple Python Matching Logic
        if not user_tags:
            return {"success": True, "documents": documents} # Return all if no tags

        for doc in documents:
            # Check if the hackathon has 'tags' and if they overlap with user_tags
            hackathon_tags = doc.get('tags', [])
            # If any tag in hackathon_tags is also in user_tags
            if any(tag in user_tags for tag in hackathon_tags):
                matches.append(doc)

        return {"success": True, "count": len(matches), "documents": matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))