import React from 'react';
import CategoriesCarousel from './CategoriesCarousel';
import Recommendations from './recomendations';
import Search from './Search';


const Main = () => {
  return (
    <main>
      <section>
        <Search />
      </section>
      <section>
        <CategoriesCarousel />
      </section>
      <section>
        <Recommendations />
      </section>
    </main>
  );
};

export default Main;
