import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css'; // Crea este archivo para los estilos
import { useAuth } from '../components/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);  // State para almacenar los usuarios
  const [isMobile, setIsMobile] = useState(false); // State para detectar si es móvil
  const { user } = useAuth();

  useEffect(() => {
    // Detectar si el usuario está en un dispositivo móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Cambia a true si el ancho de pantalla es menor o igual a 768px
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile); // Listener para cambio de tamaño de la ventana

    return () => window.removeEventListener('resize', checkIfMobile); // Limpiar listener
  }, []);

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Intentar obtener los usuarios desde el localStorage
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          // Si están en el localStorage, los cargamos
          setUsers(JSON.parse(storedUsers)); 
        } else {
          // Si no están en el localStorage, los obtenemos desde el backend
          const response = await axios.get("http://localhost:8080/api/users");
          const usersFromAPI = response.data;

          // Actualizamos el estado con los usuarios del backend
          setUsers(usersFromAPI); 

          // Guardamos los usuarios en el localStorage para persistencia
          localStorage.setItem('users', JSON.stringify(usersFromAPI)); 
        }
      } catch (error) {
        console.error("Error al cargar usuarios", error);
      }
    };

    fetchUsers();
  }, []); // Solo se ejecuta cuando el componente se monta

  if (isMobile) {
    return (
      <div className="mobile-message">
        <p>La lista de usuarios no está disponible en dispositivos móviles.</p>
      </div>
    );
  }

  if (!user || !user.admin) {
    return (
      <div className="admin-message">
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    )
  }

  const makeAdmin = async (userId) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/users/makeAdmin/${userId}`,
        { isAdmin: true }
      );

      // Actualizamos el estado de los usuarios en el array
      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, isAdmin: true } : u
      );
      setUsers(updatedUsers);

      // Guardar la lista actualizada en localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      alert("El usuario ahora es admin!");
    } catch (error) {
      console.error("Error al hacer admin:", error);
      alert("Error al hacer admin");
    }
  };

  const removeAdmin = async (userId) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/users/removeAdmin/${userId}`,
        { isAdmin: false }
      );

      // Actualizamos el estado de los usuarios en el array
      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, isAdmin: false } : u
      );
      setUsers(updatedUsers);

      // Guardar la lista actualizada en localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      alert("El usuario ya no es admin!");
    } catch (error) {
      console.error("Error al quitar admin:", error);
      alert("Error al quitar admin");
    }
  };

  return (
    <div className="user-list-container">
      <h1 className="user-list-title">Lista de Usuarios</h1>
      <p className="description">Los usuarios resaltados en la tabla son administradores.</p>
      <table className="user-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={user.isAdmin ? 'admin-row' : ''}>
              <td>{user.id}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => makeAdmin(user.id)}
                  className="make-admin-btn"
                >
                  Hacer Admin
                </button>
                <button
                  onClick={() => removeAdmin(user.id)}
                  className="remove-admin-btn"
                >
                  Quitar Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
