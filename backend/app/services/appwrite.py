from appwrite.client import Client
from appwrite.services.databases import Databases  # <--- NEW IMPORT (Was TablesDB)
from appwrite.services.users import Users
from app.core.config import settings

def get_appwrite_client():
    client = Client()
    client.set_endpoint(settings.APPWRITE_ENDPOINT)
    client.set_project(settings.APPWRITE_PROJECT_ID)
    client.set_key(settings.APPWRITE_API_KEY)
    return client

def get_db_service():
    client = get_appwrite_client()
    return Databases(client)  # <--- RETURNS 'DATABASES' (Not TablesDB)

def get_users_service():
    client = get_appwrite_client()
    return Users(client)