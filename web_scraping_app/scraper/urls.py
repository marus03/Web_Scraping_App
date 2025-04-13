from django.urls import path
from .views import scrape_api, scraped_data_api, trend_analysis_api

urlpatterns = [
    # Scrapowanie książek (będzie używane przez Reacta, więc zwróci dane JSON)
    path('scrape/', scrape_api, name='scrape'),  
    path('data/', scraped_data_api, name='scraped_data'),

    # Analiza danych (API do frontendu React)
    # path("analysis/", scraped_analysis_api, name="scraped-analysis"),
    path("trends/", trend_analysis_api, name="trend-analysis"),
    
]