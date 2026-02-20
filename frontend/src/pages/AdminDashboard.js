import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlusCircle, FaList, FaUsers, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import API from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, listings: 0, reservations: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, set mock data
    setStats({
      users: 5,
      listings: 8,
      reservations: 12,
      revenue: 2450
    });
    setLoading(false);
  }, []);

  const dashboardCards = [
    { title: 'Total Users', value: stats.users, icon: <FaUsers />, color: 'blue', link: '#' },
    { title: 'Listings', value: stats.listings, icon: <FaHome />, color: 'green', link: '/admin/listings' },
    { title: 'Reservations', value: stats.reservations, icon: <FaCalendarAlt />, color: 'purple', link: '/reservations' },
    { title: 'Total Revenue', value: `$${stats.revenue}`, icon: <FaChartBar />, color: 'orange', link: '#' }
  ];

  const quickActions = [
    { title: 'Create New Listing', icon: <FaPlusCircle />, link: '/admin/create-listing', description: 'Add a new property' },
    { title: 'View All Listings', icon: <FaList />, link: '/admin/listings', description: 'Manage existing properties' },
    { title: 'User Management', icon: <FaUsers />, link: '#', description: 'Manage user accounts' },
    { title: 'View Reservations', icon: <FaCalendarAlt />, link: '/reservations', description: 'See all bookings' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your Airbnb platform</p>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <div className="stats-grid">
              {dashboardCards.map((card, index) => (
                <div key={index} className={`stat-card ${card.color}`}>
                  <div className="stat-icon">{card.icon}</div>
                  <div className="stat-content">
                    <h3>{card.title}</h3>
                    <p className="stat-value">{card.value}</p>
                  </div>
                  <Link to={card.link} className="stat-link">View Details →</Link>
                </div>
              ))}
            </div>

            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                {quickActions.map((action, index) => (
                  <Link to={action.link} key={index} className="action-card">
                    <div className="action-icon">{action.icon}</div>
                    <div className="action-content">
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">📊</div>
                  <div className="activity-content">
                    <p><strong>System</strong> Dashboard accessed</p>
                    <small>Just now</small>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p><strong>Welcome</strong> Admin panel ready for use</p>
                    <small>Today</small>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🏠</div>
                  <div className="activity-content">
                    <p><strong>New Listing</strong> "Modern Apartment" was created</p>
                    <small>2 hours ago</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-cta">
              <h3>Need Help?</h3>
              <p>Check the documentation or contact support for assistance with the admin panel.</p>
              <div className="flex gap-3">
                <button className="btn btn-primary">View Documentation</button>
                <button className="btn btn-outline">Contact Support</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;