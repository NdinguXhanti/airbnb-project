import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateListing from './pages/CreateListing';
import ViewListings from './pages/ViewListings';
import UpdateListing from './pages/UpdateListing';
import LocationPage from './pages/LocationPage';
import LocationDetails from './pages/LocationDetails';
import Reservations from './pages/Reservations';
import { AuthProvider } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return token && user.role === 'admin' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/locations" element={<LocationPage />} />
              <Route path="/location/:id" element={<LocationDetails />} />
              <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/create-listing" element={<AdminRoute><CreateListing /></AdminRoute>} />
              <Route path="/admin/listings" element={<AdminRoute><ViewListings /></AdminRoute>} />
              <Route path="/admin/update-listing/:id" element={<AdminRoute><UpdateListing /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;