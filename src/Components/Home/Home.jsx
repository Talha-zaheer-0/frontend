import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import banner1 from '../../assets/banner/girl.png.jpg';
import banner2 from '../../assets/banner/kid.png.png';
import Banner from './Child/Banner';
import SaleCarousel from './Child/SaleCarousel';
import OfferCards from './offerCards';
import FeatureBar from './Footer/featuredBar';
import LogoCarousel from './Child/LogoCarousel';
import styles from './Home.module.css';

const Sales = lazy(() => import('./Child/Sale'));
const HotProduct = lazy(() => import('./Child/HotProduct'));
const FeaturedProduct = lazy(() => import('./Child/FeaturedProduct'));

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart({ items: [] });
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/products/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart || { items: [] });
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data || err.message);
        setCart({ items: [] });
      }
    };

    fetchCart();

    const userId = localStorage.getItem('userId');
    if (userId && socket) {
      socket.on('cartUpdate', (updatedCart) => {
        console.log('Received cart update via Socket.IO:', updatedCart);
        setCart(updatedCart || { items: [] });
      });
      socket.on('orderUpdate', (order) => {
        console.log('Received order update via Socket.IO:', order);
        if (order) {
          alert(`Order ${order.orderId} created or updated!`);
          navigate('/order-confirmation');
        }
      });
      socket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err.message);
      });
    }

    return () => {
      if (userId && socket) {
        socket.off('cartUpdate');
        socket.off('orderUpdate');
        socket.off('connect_error');
      }
    };
  }, [navigate, socket]);

  return (
    <div className="home-container home">
      <Suspense
        fallback={
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        }
      >
        <ErrorBoundary>
          <Banner className={styles.banner}
            bannerImg={banner1}
            title={'Welcome to Our Store'}
            paraGraph={'Discover amazing products and deals crafted just for you'}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <SaleCarousel socket={socket} cart={cart} />
        </ErrorBoundary>

        <ErrorBoundary>
          <Sales socket={socket} cart={cart} />
        </ErrorBoundary>

        <ErrorBoundary>
          <OfferCards />
        </ErrorBoundary>

        <ErrorBoundary>
          <LogoCarousel />
        </ErrorBoundary>

        <ErrorBoundary>
          <HotProduct socket={socket} cart={cart} />
        </ErrorBoundary>

        <ErrorBoundary>
          <Banner
            bannerImg={banner2}
            title={'Raining Offers For Hot Summer!'}
            paraGraph={'Explore our exclusive collection for kids'}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <FeaturedProduct socket={socket} cart={cart} />
        </ErrorBoundary>

        <ErrorBoundary>
          <FeatureBar />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default Home;