import React, { useState, useRef, useEffect } from 'react';
import './Search.css';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]); // Estado para almacenar los productos

  const suggestionsRef = useRef(); // Referencia al contenedor de sugerencias
  const inputRef = useRef(); // Referencia al input
  const searchContainerRef = useRef(); // Referencia al contenedor de búsqueda

  // Manejar la búsqueda de productos cuando se presiona Enter
  const handleSearch = async (e) => {
    e.preventDefault();
    setSuggestions([]); // Limpiar sugerencias cuando se haga clic en el botón de búsqueda
    try {
      const response = await axios.get('http://localhost:8080/api/products/search', {
        params: {
          name: query,
          startDate,
          endDate,
        },
      });
      setProducts(response.data); // Guardamos los productos devueltos en el estado
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };

  // Manejar la búsqueda de sugerencias mientras el usuario escribe
  const handleQueryChange = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) { // Realizar la búsqueda de sugerencias si el texto tiene más de 2 caracteres
      try {
        const response = await axios.get('http://localhost:8080/api/products/search/suggestions', {
          params: {
            name: e.target.value, // Buscar productos que coincidan parcialmente
          },
        });
        setSuggestions(response.data); // Actualizar las sugerencias
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
      }
    } else {
      setSuggestions([]); // Limpiar sugerencias si el texto tiene 2 o menos caracteres
    }
  };

  // Manejar clic en una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name); // Completa el input con el valor de la sugerencia
    setSuggestions([]); // Limpia las sugerencias
  };

  // Manejar el clic fuera del contenedor de búsqueda para ocultar las sugerencias
  const handleClickOutside = (e) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(e.target) // Verifica si el clic fue fuera del contenedor de búsqueda
    ) {
      setSuggestions([]); // Oculta las sugerencias
    }
  };

  // Agregar y limpiar el eventListener para clics fuera
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={handleQueryChange}
          className="search-input"
        />

        {/* Mostrar las sugerencias debajo del campo de búsqueda */}
        {suggestions.length > 0 && (
          <div className="suggestions-list" ref={suggestionsRef}>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)} // Completar el input al hacer clic
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}

        <div className="date-range">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="entre-fechas">AL</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button type="submit" className="search-button">Buscar</button>
      </form>

      {/* Mostrar los productos relacionados al hacer la búsqueda */}
      <div className="product-list">
        {products.map((product) => (
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

export default Search;
