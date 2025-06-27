import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './detail.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

 const DetailedPro = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const { id } = useParams();

  const popImage = (img) => {
    setMainImage(img);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
        ))}
        {halfStar && <i className="bi bi-star-half text-warning"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-warning"></i>
        ))}
      </>
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setMainImage(response.data.images[0]);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-detail-wrapper container">
      <div className="product-detail d-flex flex-row gap-4">
        {/* Left: Thumbnail Images */}
        <div className="left-thumbs d-flex flex-column gap-2">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              className={`img-thumbnail thumb-img ${mainImage === img ? 'active' : ''}`}
              onClick={() => popImage(img)}
            />
          ))}
        </div>

        {/* Middle: Main Image */}
        <div className="main-image-section">
          <img src={mainImage} alt="Main Product" className="main-image-display img-fluid" />
        </div>

        {/* Right: Product Info */}
        <div className="right-info">
          <h2 className="product-title">{product.name}</h2>

          {/* Rating */}
          <div className="rating-stars mb-2 d-flex align-items-center">
            {renderStars(product.rating || 4.3)}
            <span className="rating-text ms-2">({product.reviewsCount || 12} reviews)</span>
          </div>

          <p className="product-price h4 text-danger">
            ${product.sale ? product.salePrice : product.price}
            {product.sale && (
              <>
                <span className="old-price ms-2 text-muted text-decoration-line-through">${product.price}</span>
                <span className="discount-tag ms-2 text-success">21% off</span>
              </>
            )}
          </p>

          <p className="desc mt-3">{product.description}</p>
          <p><strong>Category:</strong> {product.category} / {product.subcategory}</p>
          <p><strong>Sizes:</strong> {product.sizes.join(', ')}</p>
          <p><strong>Bestseller:</strong> {product.bestseller ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};
  
export default DetailedPro;