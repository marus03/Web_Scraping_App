from pymongo import MongoClient
from datetime import datetime
import logging
from django.conf import settings  # Importujemy ustawienia Django

# Funkcja do łączenia się z bazą danych
def get_db_handle():
    # Używamy ustawienia z pliku settings.py
    client = MongoClient(settings.MONGO_CONNECTION_STRING)  # Połączenie z MongoDB
    db = client[settings.MONGO_DB_NAME]  # Wybieramy odpowiednią bazę danych
    return db, client

# Funkcja zapisująca dane do bazy
def insert_scraped_data(title, url, price, availability):
    db, client = get_db_handle()  # Pobieramy połączenie do bazy
    collection = db[settings.MONGO_COLLECTION_NAME]  # Wybieramy kolekcję z ustawienia w settings.py

    # Sprawdź, czy książka już istnieje w bazie na podstawie URL
    existing_book = collection.find_one({"url": url})
    
    # Jeśli książka już istnieje, dodaj nowy wpis do historii ceny
    if existing_book:
        new_history_entry = {
            "price": price,
            "availability": availability,
            "timestamp": datetime.utcnow()  # Bieżąca data i czas
        }

        # Aktualizuj książkę, dodając nowy wpis do tablicy historii
        collection.update_one(
            {"url": url},  # Szukamy książki po URL
            {"$push": {"price_history": new_history_entry}}  # Dodajemy nowy wpis do tablicy
        )
        logging.debug(f"Zaktualizowano historię książki: {title} ({url})")
    else:
        # Jeśli książka nie istnieje, dodaj ją po raz pierwszy z początkowym wpisem
        new_book = {
            "title": title,
            "url": url,
            "price_history": [
                {
                    "price": price,
                    "availability": availability,
                    "timestamp": datetime.utcnow()  # Bieżąca data i czas
                }
            ]
        }

        # Dodaj książkę do bazy
        collection.insert_one(new_book)
        logging.debug(f"Dodano nową książkę: {title} ({url})")

# Funkcja pobierająca wszystkie zescrapowane dane
def get_all_scraped_data():
    db, client = get_db_handle()  # Pobieramy połączenie do bazy
    collection = db[settings.MONGO_COLLECTION_NAME]  # Wybieramy kolekcję z ustawienia w settings.py
    # Pobierz wszystkie dane (możesz wykluczyć '_id', jeśli nie jest potrzebne)
    return list(collection.find({}, {"_id": 0}))

# Funkcja pobierająca dane książki z bazy na podstawie URL
def get_book_data(url):
    db, client = get_db_handle()  # Pobieramy połączenie do bazy
    collection = db[settings.MONGO_COLLECTION_NAME]  # Wybieramy kolekcję z ustawienia w settings.py

    book = collection.find_one({"url": url}, {"_id": 0})
    
    if book:
        latest_data = book.get("price_history", [])[-1] if "price_history" in book else None
        return {
            "title": book["title"],
            "url": book["url"],
            "price": latest_data["price"] if latest_data else None,
            "availability": latest_data["availability"] if latest_data else None,
            "timestamp": latest_data["timestamp"] if latest_data else None
        }
    return {"error": "Book not found"}
