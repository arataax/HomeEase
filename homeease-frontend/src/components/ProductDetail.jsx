import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetail.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../components/AuthContext';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [features, setFeatures] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener el detalle del producto");
        }
        const data = await response.json();
        setProduct(data);

        const datesResponse = await axios.get(`http://localhost:8080/api/products/${id}/availability`);
        setAvailableDates(datesResponse.data.availableDates);
        setOccupiedDates(datesResponse.data.occupiedDates);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}/features`);
        setFeatures(response.data);
      } catch (error) {
        console.error("Error al obtener características:", error);
      }
    };

    if (id) {
      fetchFeatures();
    }
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.includes(product?.id));
  }, [product?.id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("Debes iniciar sesión para marcar productos como favoritos.");
      navigate('/login');
      return;
    }

    try {
      const url = isFavorite
        ? `http://localhost:8080/api/users/favorites/remove`
        : `http://localhost:8080/api/users/favorites/add`;

      const response = await axios.post(url, { userId: user.id, productId: product.id });

      if (response.data) {
        setIsFavorite(!isFavorite);

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (isFavorite) {
          favorites = favorites.filter((fav) => fav !== product.id);
        } else {
          favorites.push(product.id);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al intentar marcar este producto como favorito.");
    }
  };

  if (!product) {
    return <div>Cargando...</div>;
  }

  // Para compartir en Facebook
  const handleShareFacebook = () => {
    const url = window.location.href; // La URL actual del producto
    const description = product ? product.description : "¡Mira este producto!";
    const imageUrl = product ? `http://localhost:8080${product.imageUrl}` : "";

    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${description}&picture=${imageUrl}`, '_blank');
  };

  // Para compartir en Twitter
  const handleShareTwitter = () => {
    const url = window.location.href; // La URL del producto
    const text = product ? product.name : "Producto interesante";
    const hashtags = "HomeEase";  // Hashtags para el tweet

    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`, '_blank');
  };

  // Función general de compartir
  const handleShare = () => {
    const url = window.location.href; // URL actual del producto
    const text = product ? product.name : "Producto interesante";
    const description = product ? product.description : "¡Mira este producto!";
    const imageUrl = product ? `http://localhost:8080${product.imageUrl}` : "";
    const message = shareMessage ? shareMessage : ""; // Mensaje del usuario

    // Mostrar ventana emergente con contenido para compartir
    const shareWindowWidth = 600;
    const shareWindowHeight = 400;
    const left = (window.innerWidth - shareWindowWidth) / 2;
    const top = (window.innerHeight - shareWindowHeight) / 2;

    const shareWindow = window.open(
      '',
      'share',
      `width=${shareWindowWidth},height=${shareWindowHeight},top=${top},left=${left}`
    );

    // En la ventana emergente, muestra el contenido
    shareWindow.document.write(`
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h3>Compartir producto</h3>
        <img src="${imageUrl}" alt="${product.name}" style="max-width: 100%; height: auto;" />
        <p>${description}</p>
        <p><a href="${url}" target="_blank">Ver producto completo</a></p>
        <div>
          <label for="shareMessage">Tu mensaje (opcional):</label>
          <textarea id="shareMessage" value="${message}" onchange="message = this.value"></textarea>
        </div>
        <div>
          <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${description}&picture=${imageUrl}', '_blank')" style="background-color: #4267B2; color: white; padding: 10px 20px; margin: 5px; border-radius: 5px;">Compartir en Facebook</button>
          <button onclick="window.open('https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=HomeEase&message=${message}', '_blank')" style="background-color: #1DA1F2; color: white; padding: 10px 20px; margin: 5px; border-radius: 5px;">Compartir en Twitter</button>
          <button onclick="alert('Instagram no permite compartir desde el navegador. Copia el enlace y pégalo manualmente.')" style="background-color: #E4405F; color: white; padding: 10px 20px; margin: 5px; border-radius: 5px;">Compartir en Instagram</button>
        </div>
      </div>
    `);
  };



  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">🡨 Volver</button>
      <header className="product-detail-header">
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

        <div className="favorite-icon-container">
          <button className="favorite-button" onClick={handleFavoriteToggle}>
            {isFavorite ? <FaHeart className="favorite-icon" /> : <FaRegHeart className="favorite-icon" />}
          </button>
          {/* Botón de compartir como ícono */}
          <div className="share-button-container">
            {/* Tooltip que aparecerá cuando el mouse pase por encima */}
            <div className="tooltip">Compartir</div>

            <button className="share-button" onClick={handleShare}>
              <FaShareAlt size={30} />
            </button>
          </div>
        </div>


        <div className="product-calendar">
          <h2>Seleccionar Fecha</h2>
          <h4>Los días resaltados de verde son los disponibles, los de rojo ya fueron reservados.</h4>
          <Calendar
            tileClassName={({ date, view }) => {
              if (availableDates.includes(date.toISOString().split('T')[0])) {
                return 'available-date';
              }
              if (occupiedDates.includes(date.toISOString().split('T')[0])) {
                return 'occupied-date';
              }
            }}
          />
        </div>


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
        <section className="product-policies">
          <h2 className="policy-title">Política de Uso y Cuidado del Producto</h2>
          <div className="policy-container">
            <div className="policy-item">
              <h3 className="policy-subtitle">Uso adecuado</h3>
              <p className="policy-description">
                Asegúrate de usar el producto según las indicaciones del fabricante para evitar daños.
                Es importante seguir las instrucciones de uso y realizar el mantenimiento correspondiente
                para alargar la vida útil del producto.
              </p>
            </div>

            <div className="policy-item">
              <h3 className="policy-subtitle">Mantenimiento</h3>
              <p className="policy-description">
                El mantenimiento regular es esencial para garantizar un rendimiento óptimo.
                Realiza limpieza periódica según el tipo de producto y revisa las partes esenciales
                para evitar fallos inesperados.
              </p>
            </div>

            <div className="policy-item">
              <h3 className="policy-subtitle">Condiciones de Garantía</h3>
              <p className="policy-description">
                Todos nuestros productos cuentan con una garantía limitada de 12 meses.
                La garantía cubre defectos de fabricación y no cubre daños causados por uso indebido o alteración del producto.
              </p>
            </div>

            <div className="policy-item">
              <h3 className="policy-subtitle">Devoluciones y Reembolsos</h3>
              <p className="policy-description">
                Si no estás satisfecho con tu compra, puedes devolver el producto en un plazo de 30 días desde la fecha de compra.
                El producto debe estar en condiciones originales, sin señales de uso, y con su empaque original para procesar la devolución.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
