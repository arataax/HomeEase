import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Reservations.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const Reservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:8080/api/reservations/user/${user.id}/reservations`)
        .then(response => {
          setReservations(response.data);
        })
        .catch(error => {
          console.error("Error al obtener las reservas:", error);
        });
    }
  }, [user]);

  const handleCancelReservation = (reservationId) => {
    axios.delete(`http://localhost:8080/api/reservations/cancel-reservation/${reservationId}`)
      .then(() => {
        setReservations(reservations.filter(r => r.id !== reservationId));
        alert("Reserva cancelada con éxito");
      })
      .catch(error => {
        console.error("Error al cancelar la reserva:", error);
        alert("Hubo un error al intentar cancelar la reserva");
      });
  };

  const handleRatingChange = (reservationId, field, value) => {
    setRatings({
      ...ratings,
      [reservationId]: {
        ...ratings[reservationId],
        [field]: value
      }
    });
  };

  const handleSubmitRating = (reservation) => {
    const ratingData = ratings[reservation.id];
    if (!ratingData || !ratingData.rating) {
      alert("Debe seleccionar una puntuación entre 1 y 5.");
      return;
    }

    axios.post("http://localhost:8080/api/ratings", {
      user: { id: user.id },
      product: { id: reservation.product.id },
      rating: parseInt(ratingData.rating),
      comment: ratingData.comment || ""
    })
      .then(() => {
        alert("Valoración enviada con éxito");
        setRatings({ ...ratings, [reservation.id]: {} });
      })
      .catch(err => {
        console.error("Error al enviar valoración:", err);
        alert("Ocurrió un error al enviar la valoración.");
      });
  };

  function addOneDay(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString();
  }

  function isPast(dateString) {
    const now = new Date();
    const end = new Date(dateString);
    return now > end;
  }

  if (!user) {
    alert("Es obligatorio estar logueado para ver tus productos reservados.");
    navigate('/login');
    return;
  }

  return (
    <div className="reservations-container">
      <h1 className='reservations-title'>Mis Reservas</h1>
      {reservations.length === 0 ? (
        <p className='no-reservations'>No tienes reservas activas.</p>
      ) : (
        <ul>
          {reservations.map(reservation => (
            <li key={reservation.id} className="reservation-item">
              <h3>{reservation.product.name}</h3>
              <p><strong>Fecha de inicio:</strong> {addOneDay(reservation.startDate)}</p>
              <p><strong>Fecha de fin:</strong> {addOneDay(reservation.endDate)}</p>

              <button
                className='cancel-reservation'
                onClick={() => handleCancelReservation(reservation.id)}
              >
                Cancelar reserva
              </button>

              {isPast(reservation.endDate) && (
                <div className="rating-section">
                  <h4>Valorar producto:</h4>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon={
                          star <= (ratings[reservation.id]?.rating || 0)
                            ? solidStar
                            : regularStar
                        }
                        className="star-icon"
                        onClick={() => handleRatingChange(reservation.id, "rating", star)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="rating-comment"
                    placeholder="Dejá un comentario (opcional)"
                    value={ratings[reservation.id]?.comment || ""}
                    onChange={(e) => handleRatingChange(reservation.id, "comment", e.target.value)}
                  />
                  <button
                    className="submit-rating"
                    onClick={() => handleSubmitRating(reservation)}
                  >
                    Enviar valoración
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reservations;