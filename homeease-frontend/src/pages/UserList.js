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
        const storedUsers = localStorage.getItem('users'); // Verificar si hay usuarios guardados
        if (storedUsers) {
            // Si hay usuarios guardados en localStorage, los cargamos
            setUsers(JSON.parse(storedUsers));  // Establecer los usuarios directamente
        } else {
            try {
                // Si no hay usuarios guardados, los obtenemos desde el backend
                const response = await axios.get("http://localhost:8080/api/users");
                const usersFromAPI = response.data;
                setUsers(usersFromAPI); // Guarda los usuarios en el estado
                localStorage.setItem('users', JSON.stringify(usersFromAPI)); // Guardar en localStorage
            } catch (error) {
                console.error("Error al cargar usuarios", error);
            }
        }
    };
    fetchUsers();
  }, []); // Solo se ejecuta cuando el componente se monta // Se ejecuta solo una vez cuando el componente se monta// Solo se ejecuta cuando el componente se monta

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
        const response = await axios.patch(
            `http://localhost:8080/api/users/makeAdmin/${userId}`,
            { isAdmin: true }
        );
        const updatedUser = response.data;

        // Actualizar el estado de los usuarios directamente en el array
        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, isAdmin: true } : user
        );

        setUsers(updatedUsers);  // Actualizamos el estado con el nuevo array de usuarios

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
          const response = await axios.patch(
              `http://localhost:8080/api/users/removeAdmin/${userId}`,
              { isAdmin: false }
          );
          const updatedUser = response.data;

          // Actualizar el estado de los usuarios directamente en el array
          const updatedUsers = users.map(user =>
              user.id === userId ? { ...user, isAdmin: false } : user
          );

          setUsers(updatedUsers);  // Actualizamos el estado con el nuevo array de usuarios

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

