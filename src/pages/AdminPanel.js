import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

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

  if (isMobile) {
    return (
      <div className="admin-message">
        <h1>Panel de administración no disponible en dispositivos móviles.</h1>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <button className="admin-btn" onClick={() => navigate('/administracion/lista-productos')}>
        Lista de productos
      </button>
      <button className="admin-btn" onClick={() => navigate('/add-product')}>Agregar Producto</button>
    </div>
  );
};

export default AdminPanel;
