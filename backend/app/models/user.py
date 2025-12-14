from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

# --- 1. SHARED SCHEMA ---
class UserBase(BaseModel):
    username: str
    account_id: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None  # <--- NEW
    skills: List[str] = []
    tech_stack: List[str] = []           # <--- NEW
    xp: int = 0
    reputation_score: float = 0.0

# --- 2. REGISTER INPUT ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    username: str

# --- 3. LOGIN INPUT ---
class UserLoginSync(BaseModel):
    id: str
    email: Optional[str] = None

# --- 4. UPDATE PROFILE INPUT ---
class UserUpdate(BaseModel):
    # We make everything optional so user can update just one thing
    name: Optional[str] = None           # <--- NEW (Updates Auth)
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    tech_stack: Optional[List[str]] = None # <--- NEW
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None    # <--- NEW
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
    email: str
    name: str