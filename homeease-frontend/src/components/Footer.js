import React from 'react';
import './Footer.css';
import Logo from '../images/logo.webp';
import Instagram from '../images/instagram.png';
import Twitter from '../images/twitterx.png';
import Youtube from '../images/youtube.png';
import Linkedin from '../images/linkedin.png';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-left">
          <a href="/" className="footer-logo">
            <img src={Logo} alt="Logo" className="footer-logo-img" />
            <span className="footer-title">HomeEase</span>
          </a>
          <p>© {year} HomeEase. Todos los derechos reservados.</p>
        </div>
        <div className="footer-right">
          <p>Encontranos en</p>
          <div className="footer-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={Instagram} alt="Instagram" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src={Youtube} alt="YouTube" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <img src={Twitter} alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={Linkedin} alt="LinkedIn" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
