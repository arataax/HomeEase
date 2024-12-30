import React, { useState } from "react";
import "./Navbar.css";
import Logo from '../images/logo.webp';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
        {/* Botón de toggle visible solo en pantallas pequeñas */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>

        {/* Menú de navegación, muestra u oculta según el estado */}
        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <button className="navbar-btn">Crear cuenta</button>
          <button className="navbar-btn">Iniciar sesión</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
