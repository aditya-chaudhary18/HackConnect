from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

# --- 1. SHARED SCHEMA (Matches your Appwrite Images) ---
class UserBase(BaseModel):
    username: str             # 'username' column
    account_id: str           # 'account_id' column
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    skills: List[str] = []    # 'skills' column
    xp: int = 0               # 'xp' column
    reputation_score: float = 0.0

# --- 2. REGISTER INPUT ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    username: str

# --- 3. LOGIN INPUT (For Strict Check) ---
class UserLoginSync(BaseModel):
    id: str  # The Appwrite Auth ID
    # We don't strictly need email/name here for the check, but good to have
    email: Optional[str] = None 

# --- 4. UPDATE PROFILE INPUT ---
class UserUpdate(BaseModel):
    user_id: str
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    github_url: Optional[str] = None
    avatar_url: Optional[str] = None

# --- 5. CHANGE PASSWORD INPUT ---
class PasswordChange(BaseModel):
    user_id: str
    new_password: str = Field(..., min_length=8)

# --- 6. RESPONSE OUTPUT ---
class UserResponse(UserBase):
    id: str
    created_at: str
    updated_at: str
    email: str # Added for Ansh's endpoint
    name: str  # Added for Ansh's endpoint