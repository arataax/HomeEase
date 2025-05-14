import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationConfirmation.css';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const ReservationConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="reservation-confirmation-container">
      <div className="checkmark-container">
        <AiOutlineCheckCircle size={60} color="#4caf50" />
      </div>
      <h1>¡Reserva Realizada con Éxito!</h1>
      <p>Tu reserva ha sido realizada correctamente. Te hemos enviado un correo de confirmación. Revisa la carpeta spam si no lo encuentras en tu bandeja de entrada.</p>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
};

export default ReservationConfirmation;
