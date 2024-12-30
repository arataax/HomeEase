import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./CategoriesCarousel.css";
import Limpieza from '../images/servicio-limpieza-mantenimiento.jpg';
import Reparaciones from '../images/tecnicos-reparaciones-hogar-1194x535-1.webp';
import Jardineria from '../images/istockphoto-1137974374-612x612.jpg';
import Mascotas from '../images/trabajo-de-cuidar-perros.jpg';
import Seguridad from '../images/proteccion.avif';


const categories = [
  {
    title: "Limpieza y mantenimiento",
    description: "Cuidado profesional para mantener tu hogar limpio y ordenado.",
    image: Limpieza,
  },
  {
    title: "Reparaciones y mejoras",
    description: "Soluciones rápidas para arreglos y renovaciones del hogar.",
    image: Reparaciones,
  },
  {
    title: "Jardinería y exteriores",
    description: "Cuidado y diseño para embellecer tus espacios al aire libre.",
    image: Jardineria,
  },
  {
    title: "Cuidado de mascotas",
    description: "Atención para tu mascota.",
    image: Mascotas,
  },
  {
    title: "Seguridad y protección",
    description: "Soluciones para garantizar la tranquilidad y resguardo de tu hogar.",
    image: Seguridad,
  },
];

const CategoriesCarousel = () => {
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
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content">
              <img src={category.image} alt={category.title} />
              <div className="overlay">
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoriesCarousel;
