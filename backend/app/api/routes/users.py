from fastapi import APIRouter, HTTPException
from app.services.appwrite import get_db_service, get_users_service
from app.core.config import settings
from app.models.user import UserResponse, UserUpdate

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
                "bio": doc.get('bio'),
                "avatar_url": doc.get('avatar_url'),
                "github_url": doc.get('github_url'),
                "portfolio_url": doc.get('portfolio_url'), # New Field
                "skills": doc.get('skills', []),
                "tech_stack": doc.get('tech_stack', []),   # New Field
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


# --- 2. UPDATE USER PROFILE ---
@router.put("/{user_id}", response_model=UserResponse, summary="Update User Profile")
def update_user_profile(user_id: str, user_update: UserUpdate):
    try:
        db = get_db_service()
        users = get_users_service()
        
        # A. Update Appwrite Auth (Name) if provided
        if user_update.name:
            try:
                users.update_name(user_id, user_update.name)
            except Exception as e:
                print(f"Failed to update name in Auth: {e}")

        # B. Prepare DB Update Data
        # We use .dict(exclude_unset=True) to compatible with Pydantic v1 & v2
        try:
            update_data = user_update.model_dump(exclude_unset=True)
        except AttributeError:
            # Fallback for older Pydantic versions
            update_data = user_update.dict(exclude_unset=True)
        
        # Remove fields that belong to Auth, not DB
        keys_to_remove = ["name"]
        for key in keys_to_remove:
            if key in update_data:
                del update_data[key]
            
        # C. Update Appwrite Database
        if update_data:
            try:
                db.update_document(
                    database_id=settings.APPWRITE_DATABASE_ID,
                    collection_id=settings.COLLECTION_USERS,
                    document_id=user_id,
                    data=update_data
                )
            except Exception as e:
                print(f"Appwrite Update Error: {e}")
                raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

        # D. Return fresh data
        return get_user_profile(user_id)

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))