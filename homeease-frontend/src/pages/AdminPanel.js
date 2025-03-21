import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import { useAuth } from '../components/AuthContext';

const AdminPanel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);

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
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <div className='container-btn'>
        <button className="admin-btn" onClick={() => navigate('/administracion/lista-productos')}>Lista de Productos</button>
        <button className="admin-btn" onClick={() => navigate('/administracion/add-product')}>Agregar Producto</button>
        <button className="admin-btn" onClick={() => navigate('/administracion/lista-usuarios')}>Lista de Usuarios</button>
        <button className="admin-btn" onClick={() => navigate('/administracion/manage-products')}>Administrar Características</button>
        <button className="admin-btn" onClick={() => navigate('/administracion/add-category')}>Agregar Categorias</button>
      </div>
    </div>
  );
};

export default AdminPanel;
