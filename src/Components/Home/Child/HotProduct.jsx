import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import styles from './HotProduct.module.css'; 
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import Notification from '../Notification'; // Assuming Notification is in the same directory or adjust the path
const FALLBACK_IMAGE = 'https://via.placeholder.com/250x250?text=No+Image';

function HotProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/hot', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const productsData = response.data.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          salePrice: product.price * (1 - product.discountPercentage / 100),
          image: product.images?.[0] || FALLBACK_IMAGE,
          discountPercentage: product.discountPercentage || 0,
          reviewCount: product.reviewCount || 0,
        }));
        console.log('Hot Products:', productsData.length); // Debug log
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('❌ Fetch Hot Products Error:', err.response?.data || err.message);
        setMessage(err.response?.data?.message || '❌ Failed to fetch hot products.');
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificationMessage('Product added to cart!');
      setShowNotification(true);
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message);
      setNotificationMessage('Failed to add product to cart');
      setShowNotification(true);
    }
  };

  const scrollLeft = () => {
    if (currentIndex > 0 && carouselRef.current) {
      const card = carouselRef.current.querySelector(`.${styles.card}`);
      if (card) {
        const cardWidth = card.offsetWidth + 20; // Include margins (10px left + 10px right)
        console.log('Scroll Left - Card Width:', cardWidth); // Debug log
        setCurrentIndex(prev => prev - 1);
        carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (currentIndex < products.length - 4 && carouselRef.current) {
      const card = carouselRef.current.querySelector(`.${styles.card}`);
      if (card) {
        const cardWidth = card.offsetWidth + 20; // Include margins
        console.log('Scroll Right - Card Width:', cardWidth); // Debug log
        setCurrentIndex(prev => prev + 1);
        carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">
        <span className="text-muted">Hot Products</span>  
      </h2> 

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className={styles.carouselContainer}>
          {message && <p className="mt-3 fw-semibold text-danger text-center">{message}</p>}
          {products.length === 0 ? (
            <div className="text-center text-muted">No hot products found.</div>
          ) : (
            <>
            <button
                className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                aria-label="Previous slide"
            >
                <ChevronLeftCircle size={34} />
            </button>

              <div className={styles.carousel} ref={carouselRef}>
                <div className={styles.carouselRow}>
                  {products.map((item, index) => (
                    <div key={item.id || index} className={styles.card}>
                      <Card className="h-100 shadow-sm d-flex flex-column">
                        <Card.Img
                          variant="top"
                          src={item.image}
                          style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                          alt={item.name}
                          onError={(e) => {
                            console.error(`Failed to load image for ${item.name}:`, item.image);
                            e.target.src = FALLBACK_IMAGE;
                          }}
                          onClick={() => navigate(`/product/${item.id}`)}
                        />
                        <Card.Body className="text-center d-flex flex-column justify-content-between">
                          <div>
                            <Card.Title className="fs-6 mb-2">{item.name}</Card.Title>
                            <div className="d-flex justify-content-center align-items-center mb-2">
                              <Card.Text className="fw-bold me-2">
                                ${item.salePrice.toFixed(2)}
                              </Card.Text>
                              {item.discountPercentage > 0 && (
                                <Card.Text className="text-muted text-decoration-line-through">
                                  ${item.price.toFixed(2)}
                                </Card.Text>
                              )}
                            </div>
                            {item.discountPercentage > 0 && (
                              <Card.Text className="text-success">{item.discountPercentage}% Off</Card.Text>
                            )}
                            {/* <Card.Text>Reviews: {item.reviewCount}</Card.Text> */}
                          </div>
                          <Button
                            variant="dark"
                            className="rounded-pill mt-2"
                            onClick={() => handleAddToCart(item.id)}
                          >
                            Add to Cart
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
                onClick={scrollRight}
                disabled={currentIndex >= products.length - 4}
                aria-label="Next slide"
              >
                <ChevronRightCircle size={34} />
              </button>

            </>
          )}
        </div>
      )}
      <Notification 
        show={showNotification} 
        message={notificationMessage} 
        variant={notificationMessage.includes('Failed') ? 'danger' : 'success'}
        onClose={() => setShowNotification(false)} 
      />
    </div>
  );
}

export default HotProduct;