import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="text-primary">Witaj na stronie scrapowania książek!</h1>
            <p>Wybierz akcję, którą chcesz wykonać:</p>
            <div>
                <Link to="/scrape">
                    <button className="btn btn-success mb-3">Scrapuj książkę</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
