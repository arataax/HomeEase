import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios"; // Asegúrate de tener axios instalado
import "./CategoriesCarousel.css";


const CategoriesCarousel = () => {
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías


  // Función para obtener las categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories");
        setCategories(response.data); // Asignar las categorías al estado
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };


    fetchCategories(); // Llamada a la función para obtener categorías
  }, []); // Este useEffect solo se ejecutará una vez cuando el componente se monte


  return (
    <div className="carousel-container">
      {/* Botones de navegación personalizados */}
      <button className="custom-prev">◀</button>
      <button className="custom-next">▶</button>


      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <div className="slide-content">
              {/* Asegúrate de que las categorías tengan una propiedad `image` que contenga la URL */}
              <img
                src={`http://localhost:8080/uploads/${category.imageUrl}`}
                alt={category.name} // Asegúrate de que la categoría tenga el nombre
              />
              <div className="overlay">
                <h2>{category.name}</h2> {/* Título de la categoría */}
                <p>{category.description}</p> {/* Descripción de la categoría */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};


export default CategoriesCarousel;
