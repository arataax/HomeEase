import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { id: productId } = useParams();
  const [features, setFeatures] = useState([]);

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

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${productId}/features`);
        setFeatures(response.data);
      } catch (error) {
        console.error("Error al obtener características:", error);
      }
    };

    if (productId) {
      fetchFeatures();
    }
  }, [productId]);

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="product-detail-container">
      <header className="product-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">🡨 Volver</button>
        <h1 className="product-title">{product.name}</h1>
      </header>
  
      <div className="product-detail-body">
        {product.imageUrl && (
          <img 
            src={`http://localhost:8080${product.imageUrl}`} 
            alt={product.name} 
            className="product-detail-image"
          />
        )}
        <p className="product-description">{product.description}</p>
        <p className="product-price">Precio: ${product.price}</p>
        <p className="product-stock">Stock: {product.stock}</p>
  
        {/* Sección de características */}
        <section className="product-features-product-detail">
          <h2 className="features-title-product-detail">Características</h2>
          <ul className="features-list-product-detail">
            {features.length > 0 ? (
              features.map((feature) => (
                <li key={feature.id} className="feature-item-product-detail">
                  <i className={`fa ${feature.icon} feature-icon-product-detail`}></i>
                  <span className="feature-name-product-detail">{feature.name}</span>
                </li>
              ))
            ) : (
              <p className="no-features-product-detail">No hay características para este producto.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
