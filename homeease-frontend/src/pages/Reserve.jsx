import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import './Reserve.css';

const Reserve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });

    axios.get(`http://localhost:8080/api/products/${id}/available-dates`)
      .then(response => {
        setAvailableDates(response.data);
      })
      .catch(error => {
        console.error('Error fetching available dates:', error);
      });

    axios.get(`http://localhost:8080/api/products/${id}/occupied-dates`)
      .then(response => {
        setOccupiedDates(response.data);
      })
      .catch(error => {
        console.error('Error fetching occupied dates:', error);
      });
  }, [id]);

  const markTileClass = ({ date }) => {
    const day = date.getDay();
    const dateString = date.toISOString().split('T')[0];

    if (day === 0 || day === 6) {
      return 'occupied-date';
    }

    if (availableDates.includes(dateString)) {
      return 'available-date';
    }

    if (occupiedDates.includes(dateString)) {
      return 'occupied-date';
    }

    return '';
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const handleReserve = () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert("Por favor, selecciona un rango de fechas.");
      return;
    }

    const isDateOccupiedOrWeekend = isRangeOccupiedOrWeekend(selectedStartDate, selectedEndDate);
    if (isDateOccupiedOrWeekend) {
      alert("No pueden haber fechas ocupadas ni sábados y domingos dentro del rango seleccionado.");
      return;
    }

    if (!user) {
      alert("Es obligatorio estar logueado para realizar reservas.");
      navigate('/login');
      return;
    }

    setIsLoading(true);

    const reservationData = {
      user: { id: user.id, email: user.email },
      product: { id: product.id },
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    };

    axios.post('http://localhost:8080/api/reservations/add', reservationData)
      .then(response => {
        console.log("Reserva realizada con éxito", response);
        navigate(`/reservation-confirmation`);
      })
      .catch(error => {
        console.error('Error al realizar la reserva:', error);
        alert("Hubo un error al realizar la reserva.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isRangeOccupiedOrWeekend = (startDate, endDate) => {
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const currentDateString = currentDate.toISOString().split('T')[0];

      if (occupiedDates.includes(currentDateString)) {
        return true;
      }

      const day = currentDate.getDay();
      if (day === 0 || day === 6) {
        return true;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return false;
  };

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="reserve-container">
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="reserve-header">
            <h1 className="reserve-title">Reservar: {product.name}</h1>
            {product.imageUrl && (
              <img
                src={`http://localhost:8080${product.imageUrl}`}
                alt={product.name}
                className="product-detail-image"
              />
            )}
            <p className="reserve-description">{product.description}</p>
          </div>

          <div className="calendar-container">
            <h2>Seleccionar Fecha</h2>
            <h4>Elige el rango de fechas donde quiere efectuar la reserva.Los días resaltados de verde son los disponibles, los de rojo ya fueron reservados o son días inhabiles.</h4>
            <h3>Fecha de inicio</h3>
            <Calendar
              onChange={handleStartDateChange}
              value={selectedStartDate}
              className="calendar"
              tileClassName={markTileClass}
            />

            <h3>Fecha de finalización</h3>
            <Calendar
              onChange={handleEndDateChange}
              value={selectedEndDate}
              className="calendar"
              tileClassName={markTileClass}
            />
          </div>

          <div className="reserve-info">
            <div className="user-info">
              <h3>Datos del usuario:</h3>
              <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <div className="selected-dates">
              <h3>Fechas seleccionadas:</h3>
              <p><strong>Inicio:</strong> {selectedStartDate ? selectedStartDate.toLocaleDateString() : "No seleccionada"}</p>
              <p><strong>Finalización:</strong> {selectedEndDate ? selectedEndDate.toLocaleDateString() : "No seleccionada"}</p>
            </div>
          </div>

          <button className="reserve-button" onClick={handleReserve}>
            Confirmar reserva
          </button>
        </>
      )}
    </div>
  );
};

export default Reserve;
