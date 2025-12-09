from pydantic import BaseModel
from typing import List, Optional

# This is what the frontend sends to us
class HackathonCreate(BaseModel):
    name: str
    description: str
    date: str
    location: str
    tags: List[str]  # Example: ["AI", "Web3"]
    image_url: Optional[str] = None # We might add this later

# This is just a helper to read data
class HackathonResponse(HackathonCreate):
    id: str
    created_at: str