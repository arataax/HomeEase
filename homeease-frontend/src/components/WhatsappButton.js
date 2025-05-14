import React from 'react';
import './WhatsappButton.css';

const WhatsappButton = () => {
  const phoneNumber = '+5491124092316';

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="whatsapp-icon" />
    </a>
  );
};

export default WhatsappButton;
