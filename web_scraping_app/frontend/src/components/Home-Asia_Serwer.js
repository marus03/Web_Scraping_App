// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom'; // Importuj Link z react-router-dom

const Home = () => {
    return (
        <div>
            <h1>Witaj na stronie scrapowania książek!</h1>
            <p>Wybierz akcję, którą chcesz wykonać.</p>

            {/* Link do strony scrapowania książki */}
            <Link to="/Scrape">
                <button>Scrape the book</button>
            </Link>
        </div>
    );
};

export default Home;
