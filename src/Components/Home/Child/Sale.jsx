import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import styles from './Sale.module.css';

const FALLBACK_IMAGE = 'https://via.placeholder.com/835x350?text=No+Image';

function Sale() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/sale', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const productsData = response.data.map(product => ({
          id: product._id,
          image: product.images?.[0] || FALLBACK_IMAGE,
          discountPercentage: product.discountPercentage || 0,
        }));
        console.log('Sale Products:', productsData.length); // Debug log
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('❌ Fetch Sale Products Error:', err.response?.data || err.message);
        setMessage(err.response?.data?.message || '❌ Failed to fetch sale products.');
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  useEffect(() => {
    if (products.length > 1 && carouselRef.current) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev + 1;
          const newIndex = nextIndex >= products.length ? 0 : nextIndex;
          const card = carouselRef.current.querySelector(`.${styles.carouselItem}`);
          if (card) {
            const cardWidth = card.offsetWidth + 30; // Include gutter
            carouselRef.current.scrollTo({ left: newIndex * cardWidth, behavior: 'smooth' });
          }
          return newIndex;
        });
      }, 2000); // Auto-scroll every 2 seconds
    }

    return () => clearInterval(autoScrollRef.current); // Cleanup on unmount
  }, [products]);

  const handleDotClick = (index) => {
    if (carouselRef.current) {
      clearInterval(autoScrollRef.current); // Pause auto-scroll
      setCurrentIndex(index);
      const card = carouselRef.current.querySelector(`.${styles.carouselItem}`);
      if (card) {
        const cardWidth = card.offsetWidth + 30; // Include gutter
        carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      }
      if (products.length > 1) {
        autoScrollRef.current = setInterval(() => {
          setCurrentIndex(prev => {
            const nextIndex = prev + 1;
            const newIndex = nextIndex >= products.length ? 0 : nextIndex;
            const cardInner = carouselRef.current.querySelector(`.${styles.carouselItem}`);
            if (cardInner) {
              const cardWidthInner = cardInner.offsetWidth + 30;
              carouselRef.current.scrollTo({ left: newIndex * cardWidthInner, behavior: 'smooth' });
            }
            return newIndex;
          });
        }, 2000); // Restart auto-scroll
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className=" mb-4">
        <span className="text-muted"><strong>Product on Sale</strong></span>   
      </h2> 
      <p className=" text-muted">Grab It Now 
      </p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className={styles.carouselContainer}>
          {message && <p className="mt-3 fw-semibold text-danger text-center">{message}</p>}
          {products.length === 0 ? (
            <div className="text-center text-muted">No sale products found.</div>
          ) : (
            <>
              <div className={styles.carousel} ref={carouselRef}>
                <div className={styles.carouselRow}>
                  {products.map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`${styles.carouselItem} ${index === currentIndex ? styles.active : ''}`}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.image}
                        alt="Sale Product"
                        className={styles.carouselImage}
                        onError={(e) => {
                          console.error(`Failed to load image:`, item.image);
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className={styles.discountOverlay}>
                        {item.discountPercentage}% OFF
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.carouselIndicators}>
                {products.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicatorDot} ${index === currentIndex ? styles.activeDot : ''}`}
                    onClick={() => handleDotClick(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Sale;