import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useLocation } from 'react-router-dom'; // ← zmiana tutaj
import { Link, useNavigate } from 'react-router-dom'; // ⬅️ dodaj import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';


const TrendAnalysis = () => {
    const location = useLocation(); // ← pobieranie całego URL-a
    const queryParams = new URLSearchParams(location.search);
    const bookUrl = queryParams.get('url'); // ← wyciągamy wartość ?url=

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            console.log('🔍 bookUrl:', bookUrl);

            try {
                const response = await fetch("/api/trends/?url=" + encodeURIComponent(bookUrl))
                const trendsData = await response.json();

                console.log('📦 Odpowiedź z API:', trendsData);

                if (response.ok) {
                    if (!Array.isArray(trendsData)) {
                        console.warn('⚠️ Nieprawidłowy format danych. Oczekiwano tablicy.');
                    } else {
                        const hasValidStructure = trendsData.every(item =>
                            item.hasOwnProperty('timestamp') && item.hasOwnProperty('price')
                        );

                        if (!hasValidStructure) {
                            console.warn('⚠️ Niektóre elementy nie zawierają timestamp lub price:', trendsData);
                        }
                    }

                    setData(trendsData);
                } else {
                    console.error("❌ Błąd podczas pobierania danych trendów", trendsData.error);
                }
            } catch (error) {
                console.error('❗ Błąd połączenia z backendem:', error);
            }

            setLoading(false);
        };

        if (bookUrl) {
            fetchTrends();
        } else {
            console.warn('📛 Brak bookUrl – nie wysłano zapytania.');
            setLoading(false);
        }
    }, [bookUrl]);

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    if (data.length === 0) {
        return <p>Brak historii cen dla tej książki.</p>;
    }

    const plotData = [
        {
            x: data.map(item => item.timestamp),
            y: data.map(item => {
                const parsed = parseFloat(item.price?.replace('£', ''));
                if (isNaN(parsed)) {
                    console.warn('⚠️ Nie można sparsować ceny:', item.price);
                }
                return parsed || 0;
            }),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Historia cen',
        }
    ];

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">📉 Trendy cen książki</h2>
            <Plot
                data={plotData}
                layout={{
                    title: 'Historia cen książki',
                    xaxis: { title: 'Data scrapowania' },
                    yaxis: { title: 'Cena (£)' },
                }}
                style={{ width: "100%", height: "600px" }}
            />
            <div className="text-center mt-4">
                <Link to="/" className="btn btn-outline-secondary me-2">Strona główna</Link>
            </div>
        </div>
    );
};

export default TrendAnalysis;
