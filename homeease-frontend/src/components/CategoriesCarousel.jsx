import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import "./CategoriesCarousel.css";

const CategoriesCarousel = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="carousel-container">
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
              <img
                src={`http://localhost:8080/uploads/${category.imageUrl}`}
                alt={category.name}
              />
              <div className="overlay">
                <h2>{category.name}</h2>
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
