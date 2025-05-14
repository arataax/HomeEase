import React, { useEffect, useState } from "react";
import './Recomendations.css';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [ratings, setRatings] = useState({});

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products/random");
        if (!response.ok) {
          throw new Error("Error al obtener productos aleatorios");
        }
        const data = await response.json();
        setProducts(data.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const fetchRatings = async () => {
        const ratingData = {};
        for (const product of products) {
          try {
            const [avgRes, countRes] = await Promise.all([
              axios.get(`http://localhost:8080/api/ratings/product/${product.id}/average`),
              axios.get(`http://localhost:8080/api/ratings/product/${product.id}/count`)
            ]);
            ratingData[product.id] = {
              average: avgRes.data || 0,
              count: countRes.data || 0
            };
          } catch (err) {
            console.error("Error al cargar rating del producto:", product.id, err);
          }
        }
        setRatings(ratingData);
      };

      fetchRatings();
    }
  }, [products]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prevCategories) => {
      if (checked) {
        return [...prevCategories, value];
      } else {
        return prevCategories.filter((category) => category !== value);
      }
    });
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/categories?categoryIds=${selectedCategories.join(",")}`
      );
      setFilteredProducts(response.data);
      setShowFiltered(true);
    } catch (error) {
      console.error("Error al obtener productos filtrados:", error);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setShowFiltered(false);
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  return (
    <div className="recomendations-container">
      <h1>Productos</h1>
      <div className="filter-toggle-container">
        <button onClick={toggleFilterMenu} className="filter-toggle-button">
          Filtrar <i className="fa fa-filter" aria-hidden="true"></i>
        </button>
      </div>
      {showFilterMenu && (
        <div className="filter-container">
          <h3>Filtrar por categoría</h3>
          <div className="category-filters">
            {categories.map((category) => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  value={category.id}
                  checked={selectedCategories.includes(category.id.toString())}
                  onChange={handleCategoryChange}
                />
                {category.name}
              </label>
            ))}
          </div>
          <div className="filter-button-container">
            <button onClick={handleFilter} className="filter-button">
              Filtrar
            </button>
            <button onClick={handleClearFilters} className="clear-filter-button">
              Quitar Filtros
            </button>
          </div>
        </div>
      )}
      {showFiltered && (
        <div className="filtered-products-count">
          <p>
            Se encontraron {filteredProducts.length} productos relacionados con las categorías seleccionadas.
          </p>
        </div>
      )}
      <div className="recommendations-grid">
        {(showFiltered ? filteredProducts : products).map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-rating-summary">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className="rating-star"
                  style={{
                    color: (ratings[product.id]?.average || 0) >= star ? '#FFD700' : '#CCC'
                  }}
                />
              ))}
              <span className="rating-value">
                {(ratings[product.id]?.average || 0).toFixed(1)} ({ratings[product.id]?.count || 0})
              </span>
            </div>
            <div className="product-image-container">
              {product.imageUrl && (
                <img
                  src={`http://localhost:8080${product.imageUrl}`}
                  alt={product.name}
                  className="product-image"
                />
              )}
            </div>
            <div className="product-details-container">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <button
                onClick={() => window.location.href = `/product/${product.id}`}
                className="details-button"
              >
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
