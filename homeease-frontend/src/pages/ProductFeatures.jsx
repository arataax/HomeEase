import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductFeatures.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const ProductFeatures = () => {
  const { id: productId } = useParams();
  const { name: productName } = useParams();
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ name: '', icon: '' });
  const [selectedIcon, setSelectedIcon] = useState('');
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState(null); // Estado para la característica que estamos editando

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeature({
      ...newFeature,
      [name]: value,
    });
  };

  const handleAddFeature = async () => {
    try {
      const newFeatureData = { ...newFeature, icon: selectedIcon }; // Asegúrate de incluir el icono aquí
      const response = await axios.post(`http://localhost:8080/api/products/${productId}/features`, newFeatureData);
      setFeatures([...features, response.data]);
      setNewFeature({ name: '', icon: '' }); // Limpiar los campos
      setSelectedIcon(''); // Limpiar el icono seleccionado
      alert("Característica añadida con éxito!");
    } catch (error) {
      console.error("Error al agregar característica:", error);
      alert("Error al agregar característica");
    }
  };

  const handleDeleteFeature = async (featureId) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${featureId}/features`);  // Corregido
      setFeatures(features.filter((feature) => feature.id !== featureId));
      alert("Característica eliminada con éxito!");
    } catch (error) {
      console.error("Error al eliminar característica", error);
      alert("Error al eliminar característica");
    }
  };

  const handleEditFeature = async () => {
    try {
      // Asegúrate de que el ID de la característica que quieres editar sea correcto
      const updatedFeature = {
        name: newFeature.name,
        icon: selectedIcon,
      };
      
      // Usa el featureId en la URL para realizar la edición
      await axios.put(`http://localhost:8080/api/products/${editingFeatureId}/features`, updatedFeature);
      
      // Actualiza el estado de las características para reflejar los cambios
      setFeatures(
        features.map((feature) =>
          feature.id === editingFeatureId ? { ...feature, ...updatedFeature } : feature
        )
      );
      
      // Resetear estado de edición
      setEditingFeatureId(null); // Reset editing state
      setNewFeature({ name: '', icon: '' });
      setSelectedIcon('');
      
      alert("Característica actualizada con éxito!");
    } catch (error) {
      console.error("Error al editar característica", error);
      alert("Error al editar característica");
    }
  };
  
  // Asigna el ID de la característica cuando el usuario hace clic en el botón "Editar"
  const handleSetEditingFeature = (featureId) => {
    setEditingFeatureId(featureId); // Establece el ID de la característica que se va a editar
    // Inicializa los valores de la característica que se va a editar
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      setNewFeature({ name: feature.name, icon: feature.icon });
      setSelectedIcon(feature.icon); // Establece el icono seleccionado
    }
  };
  

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); // Revisar al cargar
    window.addEventListener('resize', checkScreenSize); // Revisar en cambios

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
    <div className="product-features-container">
      <h1 className="title">Características del Producto</h1>
      <h3 className="product-info">Producto: {}</h3>
      <h3 className="product-info">ID: {productId}</h3>
  
      <h4 className="features-title">Características</h4>
      <ul className="features-list">
        {features.length > 0 ? (
          features.map((feature) => (
            <li key={feature.id} className="feature-item">
              {feature.name} - <i className={`fa ${feature.icon}`}></i>
              {/* Edit button */}
              <button onClick={() => handleSetEditingFeature(feature.id)}>Editar</button>
              {/* Delete button */}
              <button onClick={() => handleDeleteFeature(feature.id)}>Eliminar</button>
              {/* Show the edit form only for the feature being edited */}
              {editingFeatureId === feature.id && (
                <div className="edit-feature-form">
                  <h4>Editar Característica</h4>
                  <input
                    type="text"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                  />
                  <select
                    name="icon"
                    value={selectedIcon}
                    onChange={(e) => setSelectedIcon(e.target.value)}
                  >
                    <option value="">Selecciona un icono</option>
                    {/* Limpieza y Mantenimiento */}
                    <option value="fa-broom">fa-broom</option>
                    <option value="fa-lemon">fa-lemon</option>
                    <option value="fa-trash">fa-trash</option>
                    <option value="fa-vacuum">fa-vacuum</option>
                    <option value="fa-sponge">fa-sponge</option>
                    <option value="fa-brush">fa-brush</option>

                    {/* Reparaciones y Mejoras */}
                    <option value="fa-tools">fa-tools</option>
                    <option value="fa-hammer">fa-hammer</option>
                    <option value="fa-wrench">fa-wrench</option>
                    <option value="fa-screwdriver">fa-screwdriver</option>
                    <option value="fa-bolt">fa-bolt</option>
                    <option value="fa-ruler">fa-ruler</option>

                    {/* Jardinería y Exteriores */}
                    <option value="fa-pot">fa-pot</option>
                    <option value="fa-leaf">fa-leaf</option>
                    <option value="fa-rake">fa-rake</option>
                    <option value="fa-spray-can">fa-spray-can</option>
                    <option value="fa-shovel">fa-shovel</option>
                    <option value="fa-tree">fa-tree</option>
                    <option value="fa-flower">fa-flower</option>

                    {/* Cuidado de Mascotas */}
                    <option value="fa-bone">fa-bone</option>
                    <option value="fa-paw">fa-paw</option>
                    <option value="fa-cat">fa-cat</option>
                    <option value="fa-dog">fa-dog</option>
                    <option value="fa-bed">fa-bed</option>
                    <option value="fa-bowl-food">fa-bowl-food</option>

                    {/* Seguridad y Protección */}
                    <option value="fa-lock">fa-lock</option>
                    <option value="fa-bell">fa-bell</option>
                    <option value="fa-video-camera">fa-video-camera</option>
                    <option value="fa-shield-alt">fa-shield-alt</option>
                    <option value="fa-fire-extinguisher">fa-fire-extinguisher</option>
                    <option value="fa-smoke">fa-smoke</option>
                  </select>
                  <button onClick={handleEditFeature}>Guardar Cambios</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="no-features">No hay características para este producto.</p>
        )}
      </ul>
  
      <div className="add-feature-form">
        <h4 className="add-feature-title">Añadir Nueva Característica</h4>
        <input
          type="text"
          name="name"
          className="feature-input"
          placeholder="Nombre de la característica"
          value={newFeature.name}
          onChange={handleInputChange}
        />
  
        <select name="icon" className="icon-select" value={selectedIcon} onChange={(e) => setSelectedIcon(e.target.value)}>
          <option value="">Selecciona un icono</option>
            {/* Limpieza y Mantenimiento */}
            <option value="fa-broom"><i className="fa fa-broom" /> fa-broom</option>
            <option value="fa-lemon"><i className="fa fa-lemon" /> fa-lemon</option>
            <option value="fa-trash"><i className="fa fa-trash" /> fa-trash</option>
            <option value="fa-vacuum"><i className="fa fa-vacuum" /> fa-vacuum</option>
            <option value="fa-sponge"><i className="fa fa-sponge" /> fa-sponge</option>
            <option value="fa-brush"><i className="fa fa-brush" /> fa-brush</option>

            {/* Reparaciones y Mejoras */}
            <option value="fa-tools"><i className="fa fa-tools" /> fa-tools</option>
            <option value="fa-hammer"><i className="fa fa-hammer" /> fa-hammer</option>
            <option value="fa-wrench"><i className="fa fa-wrench" /> fa-wrench</option>
            <option value="fa-screwdriver"><i className="fa fa-screwdriver" /> fa-screwdriver</option>
            <option value="fa-bolt"><i className="fa fa-bolt" /> fa-bolt</option>
            <option value="fa-ruler"><i className="fa fa-ruler" /> fa-ruler</option>

            {/* Jardinería y Exteriores */}
            <option value="fa-pot"><i className="fa fa-pot" /> fa-pot</option>
            <option value="fa-leaf"><i className="fa fa-leaf" /> fa-leaf</option>
            <option value="fa-rake"><i className="fa fa-rake" /> fa-rake</option>
            <option value="fa-spray-can"><i className="fa fa-spray-can" /> fa-spray-can</option>
            <option value="fa-shovel"><i className="fa fa-shovel" /> fa-shovel</option>
            <option value="fa-tree"><i className="fa fa-tree" /> fa-tree</option>
            <option value="fa-flower"><i className="fa fa-flower" /> fa-flower</option>

            {/* Cuidado de Mascotas */}
            <option value="fa-bone"><i className="fa fa-bone" /> fa-bone</option>
            <option value="fa-paw"><i className="fa fa-paw" /> fa-paw</option>
            <option value="fa-cat"><i className="fa fa-cat" /> fa-cat</option>
            <option value="fa-dog"><i className="fa fa-dog" /> fa-dog</option>
            <option value="fa-bed"><i className="fa fa-bed" /> fa-bed</option>
            <option value="fa-bowl-food"><i className="fa fa-bowl-food" /> fa-bowl-food</option>

            {/* Seguridad y Protección */}
            <option value="fa-lock"><i className="fa fa-lock" /> fa-lock</option>
            <option value="fa-bell"><i className="fa fa-bell" /> fa-bell</option>
            <option value="fa-video-camera"><i className="fa fa-video-camera" /> fa-video-camera</option>
            <option value="fa-shield-alt"><i className="fa fa-shield-alt" /> fa-shield-alt</option>
            <option value="fa-fire-extinguisher"><i className="fa fa-fire-extinguisher" /> fa-fire-extinguisher</option>
            <option value="fa-smoke"><i className="fa fa-smoke" /> fa-smoke</option>
        </select>
  
        <button className="add-button" onClick={handleAddFeature}>Añadir Característica</button>
        <p>Icono Seleccionado</p>
  
        {selectedIcon && (
          <div className="selected-icon">
            <i className={`fa ${selectedIcon}`} style={{ fontSize: '30px' }}></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFeatures;
