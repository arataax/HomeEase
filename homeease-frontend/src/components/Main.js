import React from 'react';
import './Main.css';
import CategoriesCarousel from './CategoriesCarousel';
import Recommendations from './recomendations';
import Search from './Search';


const Main = () => {
  return (
    <main>
      {/* Sección del buscador */}
      <section className='search-container'>
        <Search/>
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
