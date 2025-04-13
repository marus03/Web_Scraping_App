import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ⬅️ dodaj import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

const Scrape = () => {
    const [url, setUrl] = useState('');
    const [scrapedData, setScrapedData] = useState(null);
    const [error, setError] = useState(null);  // Dodajemy stan błędu
    const navigate = useNavigate(); // ⬅️ używamy useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Resetowanie poprzednich danych
        setScrapedData(null);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/scrape/', {
                method: 'POST',
                body: JSON.stringify({ book_url: url }),
                headers: { 'Content-Type': 'application/json' }
            });

            // Sprawdzamy, czy odpowiedź jest poprawna
            if (!response.ok) {
                throw new Error('Nie udało się scrapować danych. Spróbuj ponownie.');
            }

            const data = await response.json();
            setScrapedData(data);

            // Po zapisaniu danych, przekieruj do analizy
            if (data.title) {
                navigate(`/scraped-analysis?url=${encodeURIComponent(url)}`);
            }
        } catch (error) {
            setError(error.message);  // Ustawienie błędu
            console.error('Error during scraping:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Scrapowanie książek</h1>
            <div className="card p-4 shadow-sm">
                <form onSubmit={handleSubmit} className="mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Podaj URL książki"
                        />
                        <button type="submit" className="btn btn-primary">Scrapuj</button>
                    </div>
                </form>
            </div>

            {/* Wyświetlanie błędów */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Wyświetlanie scrapowanych danych */}
            {scrapedData && (
                <div className="card mt-4 p-4 shadow-sm">
                    <h2 className="text-center">Scrapowane dane:</h2>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>Tytuł:</strong> {scrapedData.title}</li>
                        <li className="list-group-item"><strong>Cena:</strong> {scrapedData.price}</li>
                        <li className="list-group-item"><strong>Dostępność:</strong> {scrapedData.availability}</li>
                    </ul>
                    <div className="text-center mt-3">
                        <a href={scrapedData.url} className="btn btn-success me-2" target="_blank" rel="noopener noreferrer">
                            Link do książki
                        </a>
                    </div>
                </div>
            )}

            {/* DODANE PRZYCISKI NAWIGACJI */}
            <div className="text-center mt-4">
                <Link to="/" className="btn btn-outline-secondary me-2">Strona główna</Link>
                <Link to="/scraped-analysis" className="btn btn-outline-dark">Zobacz wykres analizy</Link>
            </div>
        </div>
    );
};

export default Scrape;
