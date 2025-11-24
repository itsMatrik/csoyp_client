import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import ErrorMessage from './components/common/ErrorMessage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import Profile from './pages/Profile';
import Cars from './pages/Cars';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Orders from './pages/Orders';
import ReviewOrder from './pages/ReviewOrder';
import Home from './pages/Home';
import { Container, CircularProgress, Box } from '@mui/material';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#E3311D' }} />
      </Box>
    );
  }

  return (
    <div className="App">
      <Header />
      <ErrorMessage />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/business" 
            element={user?.role === 'business' ? <BusinessDashboard /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cars" 
            element={user ? <Cars /> : <Navigate to="/login" />} 
          />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route 
            path="/orders" 
            element={user ? <Orders /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/order/:id/review" 
            element={user ? <ReviewOrder /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;