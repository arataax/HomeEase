import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';
import { useAuth } from '../components/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          const response = await axios.get("http://localhost:8080/api/users");
          const usersFromAPI = response.data;

          setUsers(usersFromAPI);

          localStorage.setItem('users', JSON.stringify(usersFromAPI));
        }
      } catch (error) {
        console.error("Error al cargar usuarios", error);
      }
    };

    fetchUsers();
  }, []);

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

      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, isAdmin: true } : u
      );
      setUsers(updatedUsers);

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

      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, isAdmin: false } : u
      );
      setUsers(updatedUsers);

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
