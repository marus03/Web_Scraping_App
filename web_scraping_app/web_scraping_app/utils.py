from pymongo import MongoClient
from django.conf import settings

def get_db_handle():
    client = MongoClient(settings.MONGO_CONNECTION_STRING)
    db_handle = client[settings.MONGO_DB_NAME]
    return db_handle, client