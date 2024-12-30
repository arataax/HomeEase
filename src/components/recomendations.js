import React, { useEffect, useState } from "react";
import './Recomendations.css';

const Recommendations = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="recommendations-container">
      <h2>Productos Recomendados</h2>
      <div className="recommendations-grid">
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

export default Recommendations;

