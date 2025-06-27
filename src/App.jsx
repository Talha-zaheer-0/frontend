import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './Components/Home/AuthContext';
import Signup from './Components/Home/Navbar/child/Signup';
import Home from './Components/Home/Home';
import Navbar from './Components/Home/Navbar/Navbar';
import Login from './Components/Home/Navbar/child/Login';
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
import BlockAnyUser from './Components/Home/Admin/BlockUser';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </Router>
  );
}

function MainRoutes() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith('/admin');

  return (
    <>
       <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<DetailedPro />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/*" element={<AdminPanel />}>
          <Route path="add-items" element={<AddItems />} />
          <Route path="list-items" element={<Listitem />} />
          <Route path="orders" element={<Orders />} />
          <Route path="blockusers" element={<BlockAnyUser/>}/>
        </Route>
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;