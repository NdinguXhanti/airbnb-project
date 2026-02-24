import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTrash, FaCalendarAlt, FaHome, FaUser,
  FaShieldAlt, FaHeart, FaFlag, FaNewspaper,
  FaBriefcase, FaUsers, FaHandsHelping
} from 'react-icons/fa';
import API from '../utils/api';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await API.get('/reservations/host');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations(fallbackReservations);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await API.delete(`/reservations/${id}`);
        setReservations(reservations.filter(res => res._id !== id));
        alert('Reservation deleted successfully');
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Failed to delete reservation');
      }
    }
  };

  const fallbackReservations = [
    {
      _id: '1',
      guestName: 'Johann Coetzee',
      propertyName: 'Property 1',
      checkIn: '19/06/2024',
      checkOut: '24/06/2024',
      status: 'confirmed',
      totalPrice: 1250
    },
    {
      _id: '2',
      guestName: 'Asif Hassam',
      propertyName: 'Property 2',
      checkIn: '19/06/2024',
      checkOut: '19/06/2024',
      status: 'pending',
      totalPrice: 350
    },
    {
      _id: '3',
      guestName: 'Kago Kola',
      propertyName: 'Property 1',
      checkIn: '25/06/2024',
      checkOut: '30/06/2024',
      status: 'confirmed',
      totalPrice: 975
    }
  ];

  if (loading) {
    return (
      <div className="reservations-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>My Reservations</h1>
            <p className="user-greeting">
              Welcome back, <strong>{user?.name || 'John Doe'}</strong>
            </p>
          </div>
        </div>

        <div className="dashboard-nav">
          <Link to="/reservations" className="nav-item active">
            View Reservations
          </Link>
          <Link to="/admin/listings" className="nav-item">
            View Listings
          </Link>
          <Link to="/admin/create-listing" className="nav-item">
            Create Listing
          </Link>
        </div>

        <div className="reservations-card">
          <h2 className="section-title">My Reservations</h2>
          
          <div className="table-responsive">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Booked by</th>
                  <th>Property</th>
                  <th>Check in</th>
                  <th>Check out</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      <div className="guest-info">
                        <FaUser className="guest-icon" />
                        <span>{reservation.guestName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="property-name">
                        {reservation.propertyName}
                      </span>
                    </td>
                    <td>{reservation.checkIn}</td>
                    <td>{reservation.checkOut}</td>
                    <td>
                      <span className={`status-badge ${reservation.status}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      <span className="price">R{reservation.totalPrice}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(reservation._id)}
                        className="btn-delete"
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;