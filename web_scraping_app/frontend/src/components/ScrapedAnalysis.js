// src/components/ScrapedAnalysis.js

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ScrapedAnalysis = () => {
  const location = useLocation();
  const [bookData, setBookData] = useState(null);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const url = queryParams.get('url');

  useEffect(() => {
    const fetchData = async () => {
      if (!url) {
        setError('Brak parametru URL w adresie.');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/scrape/', {
          method: 'POST',
          body: JSON.stringify({ book_url: url }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Błąd API: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.title) {
          throw new Error('Brak danych o książce.');
        }

        setBookData(data);
      } catch (err) {
        console.error('Błąd pobierania danych:', err);
        setError('Nie udało się pobrać danych o książce.');
      }
    };

    fetchData();
  }, [url]);

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">{error}</h4>
        <Link to="/" className="btn btn-outline-secondary mt-3">Strona główna</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Szczegóły zescrapowanej książki</h2>

      {bookData ? (
        <div className="card p-4 shadow-sm">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Tytuł:</strong> {bookData.title}</li>
            <li className="list-group-item"><strong>Cena:</strong> {bookData.price}</li>
            <li className="list-group-item"><strong>Dostępność:</strong> {bookData.availability}</li>
          </ul>
          <div className="text-center mt-3">
            <a href={bookData.url} className="btn btn-primary me-2" target="_blank" rel="noopener noreferrer">
              Otwórz stronę książki
            </a>
          </div>
        </div>
      ) : (
        <p className="text-center">🔄 Ładowanie danych...</p>
      )}

      <div className="text-center mt-4">
        {bookData && bookData.url && (
          <Link to={`/trends?url=${encodeURIComponent(bookData.url)}`} className="btn btn-outline-dark me-2">
            Zobacz trendy w czasie
          </Link>
        )}
        <Link to="/" className="btn btn-outline-secondary">Strona główna</Link>
      </div>
    </div>
  );
};

export default ScrapedAnalysis;
