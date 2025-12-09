import os
from dotenv import load_dotenv

# Load the .env file immediately
load_dotenv()

class Settings:
    PROJECT_NAME: str = "HackConnect Backend"
    
    # Appwrite Config
    APPWRITE_ENDPOINT: str = os.getenv("APPWRITE_ENDPOINT")
    APPWRITE_PROJECT_ID: str = os.getenv("APPWRITE_PROJECT_ID")
    APPWRITE_API_KEY: str = os.getenv("APPWRITE_API_KEY")
    APPWRITE_DATABASE_ID: str = os.getenv("APPWRITE_DATABASE_ID")
    
    # Collections
    COLLECTION_HACKATHONS: str = os.getenv("COLLECTION_HACKATHONS")
    COLLECTION_USERS: str = os.getenv("COLLECTION_USERS")
    COLLECTION_TEAMS: str = os.getenv("COLLECTION_TEAMS")

settings = Settings()