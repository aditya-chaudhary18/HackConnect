from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service
from app.core.config import settings
from app.models.team import TeamCreate
from pydantic import BaseModel
from appwrite.id import ID

router = APIRouter()

# Action Model for Delete/Leave
class TeamAction(BaseModel):
    team_id: str
    user_id: str

# --- 1. CREATE TEAM ---
@router.post("/", summary="Create a Team")
def create_team(team: TeamCreate):
    try:
        db = get_db_service()
        
        if team.leader_id not in team.members:
            team.members.append(team.leader_id)

        data_to_save = {
            "name": team.name,
            "hackathon_id": team.hackathon_id,
            "leader_id": team.leader_id,
            "members": team.members,
            "looking_for": team.looking_for,
            "status": team.status,
            "project_repo": team.project_repo
        }
        # Remove None
        data_to_save = {k: v for k, v in data_to_save.items() if v is not None}

        result = db.create_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=ID.unique(),
            data=data_to_save
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. DELETE TEAM ---
@router.delete("/delete", summary="Delete Team")
def delete_team(action: TeamAction):
    try:
        db = get_db_service()

        # Check Leader
        team = db.get_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )

        if team['leader_id'] != action.user_id:
            raise HTTPException(status_code=403, detail="Only leader can delete.")

        # Delete
        db.delete_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )
        return {"success": True, "message": "Team deleted"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 3. LEAVE TEAM ---
@router.post("/leave", summary="Leave Team")
def leave_team(action: TeamAction):
    try:
        db = get_db_service()

        # Get Team
        team = db.get_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id
        )

        current_members = team['members']

        if action.user_id not in current_members:
            raise HTTPException(status_code=400, detail="Not in team")

        current_members.remove(action.user_id)

        # Leader Left? Delete Team
        if action.user_id == team['leader_id']:
             db.delete_document( # <--- FIXED SDK METHOD
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.COLLECTION_TEAMS,
                document_id=action.team_id
            )
             return {"success": True, "message": "Leader left. Team disbanded."}

        # Update Team
        db.update_document( # <--- FIXED SDK METHOD
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            document_id=action.team_id,
            data={"members": current_members}
        )
        return {"success": True, "message": "Left team"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))