import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener el detalle del producto");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="product-detail-container">
      <header className="product-detail-header">
        <h1>{product.name}</h1>
        <button onClick={() => navigate(-1)} className="back-button">
        🡨 Volver
        </button>
      </header>
      <div className="product-detail-body">
        {product.imageUrl && (
          <img 
            src={`http://localhost:8080${product.imageUrl}`} 
            alt={product.name} 
            className="product-detail-image"
          />
        )}
        <p>{product.description}</p>
        <p>Precio: ${product.price}</p>
        <p>Stock: {product.stock}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
