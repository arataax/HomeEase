import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCategory.css';
import { useAuth } from '../components/AuthContext';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !image) {
      setError('Todos los campos son requeridos');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:8080/api/categories/add-category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccess(true);
        setName('');
        setDescription('');
        setImage(null);
      }
    } catch (error) {
      setError('Error al agregar la categoría');
      console.error(error);
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (!user || !user.admin) {
    return (
      <div className="admin-message">
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="admin-message">
        <h1>Panel de administración no disponible en dispositivos móviles.</h1>
      </div>
    );
  }

  return (
    <div className="add-category-container">
      <h1>Agregar Nueva Categoría</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Categoría agregada con éxito</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="image">Imagen:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Agregar Categoría</button>
      </form>
    </div>
  );
};

export default AddCategory;
