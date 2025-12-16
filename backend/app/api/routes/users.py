from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.user import UserResponse, UserUpdate
from appwrite.query import Query

router = APIRouter()

# --- 1. GET USER PROFILE ---
@router.get("/{user_id}", response_model=UserResponse, summary="Get User Profile")
def get_user_profile(user_id: str):
    try:
        db = get_db_service()
        users = get_users_service()
        
        try:
            # A. Fetch from Appwrite Database (Profile Data)
            doc = db.get_document(
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.COLLECTION_USERS,
                document_id=user_id
            )
            
            # B. Fetch from Appwrite Auth (Account Data)
            auth_user = users.get(user_id)

            # C. Merge and Return
            return {
                "id": doc['$id'],
                "username": doc.get('username'),
                "email": auth_user['email'],      # From Auth
                "name": auth_user['name'],        # From Auth
                "role": doc.get('role', 'participant'), # Added role
                "bio": doc.get('bio'),
                "avatar_url": doc.get('avatar_url'),
                "github_url": doc.get('github_url'),
                "portfolio_url": doc.get('portfolio_url'),
                "skills": doc.get('skills', []),
                "tech_stack": doc.get('tech_stack', []),
                "xp": doc.get('xp', 0),
                "reputation_score": doc.get('reputation_score', 0.0),
                "account_id": doc.get('account_id'),
                "created_at": doc['$createdAt'],
                "updated_at": doc['$updatedAt']
            }
            
        except Exception as e:
            if "404" in str(e):
                raise HTTPException(status_code=404, detail="User not found")
            raise e

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}", response_model=UserResponse, summary="Update User Profile")
def update_user_profile(user_id: str, user_update: UserUpdate):
    try:
        db = get_db_service()
        users = get_users_service()
        
        # 1. Update Appwrite Auth (Name) if provided
        if user_update.name:
            try:
                users.update_name(user_id, user_update.name)
            except Exception as e:
                print(f"Failed to update name in Auth: {e}")

        # 2. Prepare DB Update Data
        # Fix: Use model_dump instead of dict (Pydantic v2)
        update_data = user_update.model_dump(exclude_unset=True)
        
        # Remove fields that are not in the Appwrite DB Schema
        # The user's schema only has: username, bio, avatar_url, github_url, portfolio_url, skills, xp, reputation_score, account_id
        keys_to_remove = ["name"]
        for key in keys_to_remove:
            if key in update_data:
                del update_data[key]
            
        # 3. Update Appwrite Database
        if update_data:
            try:
                db.update_document(
                    database_id=settings.APPWRITE_DATABASE_ID,
                    collection_id=settings.COLLECTION_USERS,
                    document_id=user_id,
                    data=update_data
                )
            except Exception as e:
                print(f"Appwrite Update Error: {e}") # Log the specific error
                raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

        # 4. Fetch and Return Updated Profile (Reuse existing logic or call get_user_profile)
        # For simplicity, let's just call the get logic again to ensure we return the fresh state
        return get_user_profile(user_id)

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/hackathons", summary="Get User's Hackathons")
def get_user_hackathons(user_id: str):
    try:
        db = get_db_service()
        
        # 1. Find teams where user is a member
        teams_result = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_TEAMS,
            queries=[
                Query.equal('members', user_id)
            ]
        )

        # 2. Map Hackathon ID to Team
        # A user might be in multiple teams for different hackathons, but usually 1 team per hackathon.
        # We'll create a map: hackathon_id -> team_document
        hackathon_team_map = {team['hackathon_id']: team for team in teams_result['documents']}
        hackathon_ids = list(hackathon_team_map.keys())
        
        if not hackathon_ids:
            return {"success": True, "hackathons": []}

        # 3. Fetch Hackathon Details
        hackathons_result = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.COLLECTION_HACKATHONS,
            queries=[
                Query.equal('$id', hackathon_ids)
            ]
        )
        
        # 4. Combine Hackathon + Team Info
        combined_results = []
        for hackathon in hackathons_result['documents']:
            team = hackathon_team_map.get(hackathon['$id'])
            # Add team info to the hackathon object or wrap it
            # Let's wrap it to be clean
            combined_results.append({
                **hackathon,
                "my_team": team
            })
        
        return {"success": True, "hackathons": combined_results}

    except Exception as e:
        print(f"Error fetching user hackathons: {e}")
        raise HTTPException(status_code=500, detail=str(e))
