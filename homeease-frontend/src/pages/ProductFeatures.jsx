import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductFeatures.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const ProductFeatures = () => {
  const { id: productId } = useParams();
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ name: '', icon: '' });
  const [selectedIcon, setSelectedIcon] = useState('');
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState(null);

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

  useEffect(() => {
    const fetchProductName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
        setProductName(response.data.name);
      } catch (error) {
        console.error("Error al obtener el nombre del producto:", error);
      }
    };

    if (productId) {
      fetchProductName();
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
      const newFeatureData = { ...newFeature, icon: selectedIcon };
      const response = await axios.post(`http://localhost:8080/api/products/${productId}/features`, newFeatureData);
      setFeatures([...features, response.data]);
      setNewFeature({ name: '', icon: '' });
      setSelectedIcon('');
      alert("Característica añadida con éxito!");
    } catch (error) {
      console.error("Error al agregar característica:", error);
      alert("Error al agregar característica");
    }
  };

  const handleDeleteFeature = async (featureId) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${featureId}/features`);
      setFeatures(features.filter((feature) => feature.id !== featureId));
      alert("Característica eliminada con éxito!");
    } catch (error) {
      console.error("Error al eliminar característica", error);
      alert("Error al eliminar característica");
    }
  };

  const handleEditFeature = async () => {
    try {
      const updatedFeature = {
        name: newFeature.name,
        icon: selectedIcon,
      };

      await axios.put(`http://localhost:8080/api/products/${editingFeatureId}/features`, updatedFeature);

      setFeatures(
        features.map((feature) =>
          feature.id === editingFeatureId ? { ...feature, ...updatedFeature } : feature
        )
      );

      setEditingFeatureId(null);
      setNewFeature({ name: '', icon: '' });
      setSelectedIcon('');

      alert("Característica actualizada con éxito!");
    } catch (error) {
      console.error("Error al editar característica", error);
      alert("Error al editar característica");
    }
  };

  const handleSetEditingFeature = (featureId) => {
    setEditingFeatureId(featureId);
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      setNewFeature({ name: feature.name, icon: feature.icon });
      setSelectedIcon(feature.icon);
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
    <div className="product-features-container">
      <h1 className="title">Características del Producto</h1>
      <h3 className="product-info">Producto: {productName}</h3>
      <h3 className="product-info">ID: {productId}</h3>

      <h4 className="features-title">Características</h4>
      <ul className="features-list">
        {features.length > 0 ? (
          features.map((feature) => (
            <li key={feature.id} className="feature-item">
              {feature.name} - <i className={`fa ${feature.icon}`}></i>
              <button onClick={() => handleSetEditingFeature(feature.id)} className='edit-button'>Editar</button>
              <button onClick={() => handleDeleteFeature(feature.id)} className='delete-button'>Eliminar</button>
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
                    <option value="fa-trash">fa-trash</option>
                    <option value="fa-wrench">fa-wrench</option>
                    <option value="fa-leaf">fa-leaf</option>
                    <option value="fa-tree">fa-tree</option>
                    <option value="fa-paw">fa-paw</option>
                    <option value="fa-bed">fa-bed</option>
                    <option value="fa-lock">fa-lock</option>
                    <option value="fa-bell">fa-bell</option>
                    <option value="fa-video-camera">fa-video-camera</option>
                    <option value="fa-clock-o">fa-clock</option>
                    <option value="fa-times">fa-times</option>
                    <option value="fa-magic">fa-magic</option>
                    <option value="fa-cogs">fa-cogs</option>
                    <option value="fa-thermometer-full">fa-thermometer-full</option>
                    <option value="fa-flask">fa-flask</option>
                    <option value="fa-home">fa-home</option>
                    <option value="fa-building">fa-building</option>
                    <option value="fa-usd">fa-usd</option>
                    <option value="fa-shield">fa-shield</option>
                    <option value="fa-paint-brush">fa-paint-brush</option>
                    <option value="fa-picture-o">fa-picture-o</option>
                    <option value="fa-sun-o">fa-sun-o</option>
                    <option value="fa-tree">fa-tree</option>
                    <option value="fa-tint">fa-tint</option>
                    <option value="fa-flask">fa-flask</option>
                    <option value="fa-cutlery">fa-cutlery</option>
                    <option value="fa-bath">fa-bath</option>
                    <option value="fa-scissors">fa-scissors</option>
                    <option value="fa-angle-double-up">fa-angle-double-up</option>
                    <option value="fa-bolt">fa-bolt</option>
                    <option value="fa-user-md">fa-user-md</option>
                    <option value="fa-h-square">fa-h-square</option>
                    <option value="fa-desktop">fa-desktop</option>
                    <option value="fa-volume-up">fa-volume-up</option>
                    <option value="fa-user-secret">fa-user-secret</option>
                    <option value="fa-line-chart">fa-line-chart</option>
                    <option value="fa-check">fa-check</option>
                    <option value="fa-fire-extinguisher">fa-fire-extinguisher</option>
                  </select>
                  <button onClick={handleEditFeature} className='save-button'>Guardar Cambios</button>
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
          <option value="fa-trash"><i className="fa fa-trash" /> fa-trash</option>
          <option value="fa-wrench"><i className="fa fa-wrench" /> fa-wrench</option>
          <option value="fa-leaf"><i className="fa fa-leaf" /> fa-leaf</option>
          <option value="fa-tree"><i className="fa fa-tree" /> fa-tree</option>
          <option value="fa-paw"><i className="fa fa-paw" /> fa-paw</option>
          <option value="fa-bed"><i className="fa fa-bed" /> fa-bed</option>
          <option value="fa-lock"><i className="fa fa-lock" /> fa-lock</option>
          <option value="fa-bell"><i className="fa fa-bell" /> fa-bell</option>
          <option value="fa-video-camera"><i className="fa fa-video-camera" /> fa-video-camera</option>
          <option value="fa-clock-o"><i className="fa fa-clock-o" /> fa-clock</option>
          <option value="fa-times"><i className="fa fa-times" /> fa-times</option>
          <option value="fa-magic"><i className="fa fa-magic" /> fa-magic</option>
          <option value="fa-cogs"><i className="fa fa-cogs" /> fa-cogs</option>
          <option value="fa-thermometer-full"><i className="fa fa-thermometer-full" /> fa-thermometer-full</option>
          <option value="fa-flask"><i className="fa fa-flask" /> fa-flask</option>
          <option value="fa-home"><i className="fa fa-home" /> fa-home</option>
          <option value="fa-building"><i className="fa fa-building" /> fa-building</option>
          <option value="fa-usd"><i className="fa fa-usd" /> fa-usd</option>
          <option value="fa-shield"><i className="fa fa-shield" /> fa-shield</option>
          <option value="fa-paint-brush"><i className="fa fa-paint-brush" /> fa-paint-brush</option>
          <option value="fa-picture-o"><i className="fa fa-picture-o" /> fa-picture-o</option>
          <option value="fa-sun-o"><i className="fa fa-sun-o" /> fa-sun-o</option>
          <option value="fa-tint"><i className="fa fa-tint" /> fa-tint</option>
          <option value="fa-flask"><i className="fa fa-flask" /> fa-flask</option>
          <option value="fa-cutlery"><i className="fa fa-cutlery" /> fa-cutlery</option>
          <option value="fa-bath"><i className="fa fa-bath" /> fa-bath</option>
          <option value="fa-scissors"><i className="fa fa-scissors" /> fa-scissors</option>
          <option value="fa-angle-double-up"><i className="fa fa-angle-double-up" /> fa-angle-double-up</option>
          <option value="fa-bolt"><i className="fa fa-bolt" /> fa-bolt</option>
          <option value="fa-user-md"><i className="fa fa-user-md" /> fa-user-md</option>
          <option value="fa-h-square"><i className="fa fa-h-square" /> fa-h-square</option>
          <option value="fa-desktop"><i className="fa fa-desktop" /> fa-desktop</option>
          <option value="fa-volume-up"><i className="fa fa-volume-up" /> fa-volume-up</option>
          <option value="fa-user-secret"><i className="fa fa-user-secret" /> fa-user-secret</option>
          <option value="fa-line-chart"><i className="fa fa-line-chart" /> fa-line-chart</option>
          <option value="fa-check"><i className="fa fa-check" /> fa-check</option>
          <option value="fa-fire-extinguisher"><i className="fa fa-fire-extinguisher" /> fa-fire-extinguisher</option>
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
