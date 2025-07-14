import React, { useEffect, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const AdminPanel = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    console.log('AdminPanel useEffect running at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
    const token = localStorage.getItem('token');
    console.log('Token found:', token ? token : 'No token');

    if (!token) {
      console.log('No token, redirecting to /login');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded, 'isOwner:', decoded.isOwner);
      if (!decoded.isAdmin) {
        console.log('Not an admin, redirecting to /');
        navigate('/', { replace: true });
      } else {
        console.log('Admin verified, staying on /admin');
      }
    } catch (err) {
      console.error('Token validation error:', err.name, err.message);
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="d-flex vh-100 bg-light">
      <div className="bg-white border-end p-3" style={{ width: '250px' }}>
        <div className="mb-5"></div>
        <Sidebar />
      </div>
      <div className="flex-grow-1"> 
        <div className="p-4 text-dark">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;