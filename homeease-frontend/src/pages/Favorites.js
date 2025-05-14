import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';
import { useAuth } from '../components/AuthContext';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Debes iniciar sesión para ver tus productos favoritos');
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/favorites?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error al obtener los favoritos', error);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const removeFavorite = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Debes iniciar sesión para eliminar un producto de favoritos');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/users/favorites/remove/${productId}?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setFavorites(favorites.filter(product => product.id !== productId));

      let storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      storedFavorites = storedFavorites.filter(fav => fav !== productId);
      localStorage.setItem('favorites', JSON.stringify(storedFavorites));

    } catch (error) {
      console.error('Error al eliminar favorito', error);
    }
  };

  if (!user) {
    alert("Es obligatorio estar logueado para ver tus productos favoritos.");
    navigate('/login');
    return;
  }

  return (
    <div className="favorites-container">
      <h1>Mis Productos Favoritos</h1>
      {favorites.length > 0 ? (
        <div className="favorites-list">
          {favorites.map(product => (
            <div key={product.id} className="favorite-item">
              <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} />
              <div className="favorite-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button
                  onClick={() => window.location.href = `/product/${product.id}`}
                  className="details-button"
                >
                  Ver Detalle
                </button>
                <button onClick={() => removeFavorite(product.id)} className="remove-favorite-btn">
                  Eliminar de Favoritos
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='no-products'>No tienes productos favoritos.</p>
      )}
    </div>
  );
};

export default Favorites;
