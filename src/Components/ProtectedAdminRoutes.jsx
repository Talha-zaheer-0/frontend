import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.isAdmin) return <Navigate to="/" replace />;
    return <Outlet />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedAdminRoute;