import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .mongo_operations import get_all_scraped_data, insert_scraped_data, get_book_data
from .utils import scrape_books_to_scrape
from datetime import datetime
import json
from .mongo_operations import get_db_handle


# Konfiguracja logowania
logging.basicConfig(level=logging.DEBUG)

# API zwracające zescrapowane dane
def scraped_data_api(request):
    data = get_all_scraped_data()
    return JsonResponse({"scraped_data": data})

@csrf_exempt  # ← wciąż tylko na potrzeby testów lokalnych
def scrape_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            book_url = data.get(
                "book_url",
                "http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html"
            )
        except json.JSONDecodeError:
            return JsonResponse({"error": "Nieprawidłowy JSON"}, status=400)

        book_data = scrape_books_to_scrape(book_url)
        logging.debug(f"Zescrapowane dane: {book_data}")
        
        # Zapisujemy dane do bazy
        insert_scraped_data(
            title=book_data["title"],
            url=book_data["url"],
            price=book_data["price"],  # Używamy ceny
            availability=book_data["availability"],  # Używamy dostępności
        )
        
        # Pobieramy najnowsze dane książki z bazy
        book_data_from_db = get_book_data(book_url)
        
        return JsonResponse(book_data_from_db)
    
    return JsonResponse({"error": "Tylko metoda POST jest obsługiwana"}, status=400)

"""
# API analizy zescrapowanych danych (dla wykresu z dwóch URL)
def scraped_analysis_api(request):
    book_urls = [
        "http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
        "http://books.toscrape.com/catalogue/the-secret-of-annexe-3_999/index.html",
    ]
    
    # Zescrapowanie danych
    scraped_books = [scrape_books_to_scrape(url) for url in book_urls]
    
    # Analiza danych i uzyskanie wykresu w formacie JSON
    chart_json = analyze_scraped_data(scraped_books)
    
    # Zwrócenie wyników analizy
    return JsonResponse(chart_json)  # Teraz powinno działać poprawnie
"""

def trend_analysis_api(request):
    book_url = request.GET.get("url")
    if not book_url:
        return JsonResponse({"error": "Brak parametru URL"}, status=400)

    # Zbierz dane książki
    db, _ = get_db_handle()
    collection = db["scraped_data"]
    book = collection.find_one({"url": book_url}, {"_id": 0})
    
    # Sprawdzamy, czy książka istnieje w bazie
    if not book:
        return JsonResponse({"error": "Brak książki w bazie danych"}, status=404)
    
    # Sprawdzamy, czy książka ma historię cen
    if "price_history" not in book:
        return JsonResponse({"error": "Brak historii cen"}, status=404)

    # Tworzymy listę trendów na podstawie historii cen
    trends = [
        {
            "timestamp": entry["timestamp"].isoformat(),
            "price": entry["price"]
        }
        for entry in book["price_history"]
    ]

    # Zwracamy dane w formacie JSON
    return JsonResponse(trends, safe=False)
