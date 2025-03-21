import React from 'react';
import './Main.css';
import CategoriesCarousel from './CategoriesCarousel';
import Recommendations from './recomendations';


const Main = () => {
  return (
    <main className="main-container">
      {/* Sección del buscador */}
      <section className="search-bar">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-input"
        />
        <button className="search-button">Buscar</button>
      </section>

      {/* Carrusel de categorías */}
      <section>
        <CategoriesCarousel />
      </section>

      {/* Sección de recomendaciones */}
      <section>
        <Recommendations />
      </section>
    </main>
  );
};

export default Main;
