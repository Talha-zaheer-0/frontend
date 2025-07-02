import React, { useState, useEffect } from 'react';
import styles from './Sale.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Fallback image URL for invalid/missing images
const FALLBACK_IMAGE = 'https://via.placeholder.com/250x150?text=No+Image';

function Sale() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Sort products by discountPercentage in descending order and take top 8
        const sortedProducts = response.data
          .sort((a, b) => b.discountPercentage - a.discountPercentage)
          .slice(0, 10)
          .map(product => {
            const imageUrl = validateImage(product.image);
            // Log image URL for debugging
            console.log(`Product ${product.name} image URL:`, imageUrl);
            return {
              id: product._id,
              name: product.name,
              price: product.price,
              salePrice: product.price * (1 - product.discountPercentage / 100),
              image: imageUrl,
              color: product.color || `142, ${Math.floor(Math.random() * 113) + 142}, ${Math.floor(Math.random() * 113) + 142}`,
            };
          });
        setProducts(sortedProducts);
      } catch (err) {
        console.error('❌ Fetch Sale Products Error:', err.response?.data || err.message);
        setMessage(err.response?.data?.message || '❌ Failed to fetch sale products.');
      }
    };

    fetchSaleProducts();
  }, []);

  // Validate and optimize Cloudinary image URLs
  const validateImage = (image) => {
    if (!image || typeof image !== 'string') {
      console.warn('Invalid or missing image:', image);
      return FALLBACK_IMAGE;
    }
    // Check if it's a Cloudinary URL and add transformations
    if (image.includes('res.cloudinary.com')) {
      // Add transformations for 250x150, crop fill
      const urlParts = image.split('/upload/');
      if (urlParts.length === 2) {
        return `${urlParts[0]}/upload/w_250,h_150,c_fill/${urlParts[1]}`;
      }
    }
    // Check for other valid URLs or base64
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:image/')) {
      return image;
    }
    console.warn('Invalid image format:', image);
    return FALLBACK_IMAGE;
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Sale Items</h2>
      {message && <p className="mt-3 fw-semibold text-danger">{message}</p>}
      {products.length > 0 ? (
        <div className={styles.wrapper}>
          <div className={styles.inner} style={{ "--quantity": products.length }}>
            {products.map((item, index) => (
              <div
                className={styles.card}
                onClick={() => navigate(`/product/${item.id}`, { state: { image: item.image } })}
                style={{ "--index": index, "--color-card": item.color }}
                key={item.id}
              >
                <img
                  src={item.image}
                  className={styles.img}
                  alt={item.name}
                  onError={(e) => {
                    console.error(`Failed to load image for ${item.name}:`, item.image);
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
                <div className={styles.cardBody}>
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">
                    <span className="text-decoration-line-through text-muted">${item.price.toFixed(2)}</span>
                    <span className="text-danger fw-bold ms-2">${item.salePrice.toFixed(2)}</span>
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Added ${item.name} to cart`, { ...item, image: item.image });
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No sale items found</p>
      )}
    </div>
  );
}

export default Sale;  