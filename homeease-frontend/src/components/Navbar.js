import React, { useState } from "react";
import "./Navbar.css";
import { useAuth } from './AuthContext';
import Logo from '../images/logo-homeEase.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-logo">
          <img src={Logo} alt="Logo" className="navbar-logo-img" />
          <span className="navbar-title">HomeEase</span>
        </a>
      </div>
      <div className="navbar-right">
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          {user ? (
            <div className="navbar-user">
              <div className="navbar-user-info" onClick={toggleDropdown}>
                <span className="letters">{user.firstName[0]}{user.lastName[0]}</span>
              </div>
              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <button onClick={() => window.location.href = `/administracion`} className="navbar-admin-btn">
                    Administración
                  </button>
                  <button onClick={() => window.location.href = `/favorites`} className="navbar-user-favorite">Favoritos</button>
                  <button onClick={() => window.location.href = `/reservations`} className="navbar-user-reservations">Mis Reservas</button>
                  <button onClick={logout} className="navbar-user-btn">Cerrar sesión</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => window.location.href = `/register`} className="navbar-btn">Crear cuenta</button>
              <button onClick={() => window.location.href = `/login`} className="navbar-btn">Iniciar sesión</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
