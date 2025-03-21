import React, { useEffect, useState } from "react";
import './Recomendations.css';
import axios from "axios";

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false); // Estado para mostrar/ocultar el filtro

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
        setProducts(data.slice(0, 10)); // Limita a 10 productos
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

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
    setSelectedCategories([]); // Vaciar categorías seleccionadas
    setShowFiltered(false); // Mostrar todos los productos
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  return (
    <div className="recomendations-container">
      <h1>Productos</h1>
      
      {/* Botón con el ícono para mostrar/ocultar el filtro */}
      <div className="filter-toggle-container">
        <button onClick={toggleFilterMenu} className="filter-toggle-button">
          Filtrar <i className="fa fa-filter" aria-hidden="true"></i>
        </button>
      </div>

      {/* Filtro por categoría (se despliega al hacer clic en el ícono de Filtrar) */}
      {showFilterMenu && (
        <div className="filter-container">
          <h3>Filtrar por categoría</h3>
          <div className="category-filters">
            {categories.map((category) => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  value={category.id}
                  checked={selectedCategories.includes(category.id.toString())}  // Esto asegura que el checkbox esté marcado si está en selectedCategories
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

      {/* Mostrar la cantidad de productos filtrados */}
      {showFiltered && (
        <div className="filtered-products-count">
          <p>
            Se encontraron {filteredProducts.length} productos relacionados con las categorías seleccionadas.
          </p>
        </div>
      )}

      {/* Mostrar los productos */}
      <div className="recommendations-grid">
        {(showFiltered ? filteredProducts : products).map((product) => (
          <div className="product-card" key={product.id}>
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
