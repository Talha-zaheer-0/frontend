import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './Components/Home/AuthContext';
import Signup from './Components/Home/Navbar/child/Signup';
import Home from './Components/Home/Home';
import Navbar from './Components/Home/Navbar/Navbar';
import Login from './Components/Home/Navbar/child/login';
import About from './Components/Home/Navbar/child/About';
import Collection from './Components/Home/Child/Collection';
import DetailedPro from './Components/Home/Child/details';
import Contact from './Components/Home/Navbar/child/Contact';
import Footer from './Components/Home/Footer/Footer';
import AdminPanel from './Components/Home/Admin/Admin';
import AddItems from './Components/Home/Admin/AddItems';
import Listitem from './Components/Home/Admin/Listitems';
import Orders from './Components/Home/Admin/Orders';
import Profile from './Components/Home/Navbar/child/Profile';
import Cart from './Components/Home/Navbar/child/Cart';
import Checkout from './Components/Home/Navbar/child/Checkout';
import OrderConfirmation from './Components/Home/Navbar/child/OrderConfirmation';
import BlockAnyUser from './Components/Home/Admin/BlockUser';
import AddChildAdmin from './Components/Home/Admin/AddChildAdmin';
import ChildAdmins from './Components/Home/Admin/ChildAdmins';
import VerifyChildAdmin from './Components/Home/Admin/VerifyChildAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token'),
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function App() {
  useEffect(() => {
    const handleTokenChange = () => {
      const newToken = localStorage.getItem('token');
      if (socket.auth.token !== newToken) {
        socket.auth.token = newToken;
        socket.disconnect().connect();
        console.log('Socket.IO reconnected with new token');
      }
    };
    window.addEventListener('authChange', handleTokenChange);

    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });
    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });
    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    return () => {
      window.removeEventListener('authChange', handleTokenChange);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      // Do not disconnect socket here to allow persistent connection for navbar updates
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <MainRoutes socket={socket} />
      </AuthProvider>
    </Router>
  );
}

function MainRoutes({ socket }) {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith('/admin') && location.pathname !== '/admin/verify';

  return (
    <>
      <Navbar socket={socket} className="fixed" />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/about" element={<About />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<DetailedPro />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart socket={socket} />} />
          <Route path="/checkout" element={<Checkout socket={socket} />} />
          <Route path="/order-confirmation" element={<OrderConfirmation socket={socket} />} />
          <Route path="/admin/verify" element={<VerifyChildAdmin />} />
          <Route path="/admin/*" element={<AdminPanel socket={socket} />}>
            <Route path="add-items" element={<AddItems socket={socket} />} />
            <Route path="add-items/:id" element={<AddItems socket={socket} />} />
            <Route path="list-items" element={<Listitem socket={socket} />} />
            <Route path="orders" element={<Orders socket={socket} />} />
            <Route path="blockusers" element={<BlockAnyUser socket={socket} />} />
            <Route path="add-child-admin" element={<AddChildAdmin socket={socket} />} />
            <Route path="child-admins" element={<ChildAdmins socket={socket} />} />
          </Route>
        </Routes>
        {!hideNavAndFooter && <Footer />}
      </div>
    </>
  );
}

export default App;