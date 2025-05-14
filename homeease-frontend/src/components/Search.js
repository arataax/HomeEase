import React, { useState, useRef, useEffect } from 'react';
import './Search.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});

  const suggestionsRef = useRef();
  const inputRef = useRef();
  const searchContainerRef = useRef();

  const handleSearch = async (e) => {
    e.preventDefault();
    setSuggestions([]);
    try {
      const response = await axios.get('http://localhost:8080/api/products/search', {
        params: {
          name: query,
          startDate,
          endDate,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };

  const handleQueryChange = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.get('http://localhost:8080/api/products/search/suggestions', {
          params: {
            name: e.target.value,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
  };

  const handleClickOutside = (e) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(e.target)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
        {suggestions.length > 0 && (
          <div className="suggestions-list" ref={suggestionsRef}>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
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
      <div className="product-list">
        {products.map((product) => (
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

export default Search;
