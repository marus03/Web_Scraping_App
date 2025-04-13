import logging
import requests
from bs4 import BeautifulSoup
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.urls import path

# Ustawienie poziomu logowania na WARNING, aby ignorować DEBUG
logging.basicConfig(level=logging.WARNING)

# Funkcja do scrapowania danych z Books to Scrape
def scrape_books_to_scrape(book_url):
    """Scrapowanie danych z Books to Scrape"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        response = requests.get(book_url, headers=headers, timeout=25)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logging.error(f"Błąd połączenia: {e}")
        return {"error": f"Błąd połączenia: {e}"}

    soup = BeautifulSoup(response.text, 'html.parser')

    title = soup.find('h1').text.strip() if soup.find('h1') else 'Brak tytułu'
    
    price_tag = soup.find('p', class_='price_color')
    if price_tag:
        price = price_tag.text.strip()
        # Usuwanie błędnych znaków z ceny (np. 'Â') i konwersja na float
        price = price.replace('Â', '').replace('€', '').strip()  # Usuwamy nieprawidłowe znaki
    else:
        price = 'Brak ceny'
    
    stock_tag = soup.find('p', class_='instock availability')
    stock = stock_tag.text.strip() if stock_tag else 'Brak informacji o dostępności'

    logging.debug(f"Scrapowane dane: tytuł: {title}, cena: {price}, dostępność: {stock}")

    return {
        'title': title,
        'price': price,
        'availability': stock,
        'url': book_url,
    }

# Serializator
class BookDataSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    price = serializers.CharField(max_length=255)
    availability = serializers.CharField(max_length=255)
    url = serializers.URLField()

# Widok API do scrapowania danych
class ScrapedDataView(APIView):
    def get(self, request, *args, **kwargs):
        book_url = "http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html"
        scraped_data = scrape_books_to_scrape(book_url)
        serializer = BookDataSerializer(scraped_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Definicja URL w aplikacji Django
urlpatterns = [
    path('api/scraped_data/', ScrapedDataView.as_view(), name='scraped-data-api'),
]
