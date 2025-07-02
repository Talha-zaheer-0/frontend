import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const DetailedPro = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch product and reviews
  useEffect(() => {
    if (!productId) return;

    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(res => {
        setProduct(res.data);
        setMainImage(res.data.images?.[0] || '');
      })
      .catch(err => console.log('Error loading product:', err));

    axios.get(`http://localhost:5000/api/products/reviews/${productId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.log('Error loading reviews:', err));
  }, [productId]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/products/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message);
      alert('Failed to add product to cart');
    }
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!comment.trim() || !rating) {
      alert('Please provide a comment and rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/products/review`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([res.data.review, ...reviews]);
      setComment('');
      setRating(0);
    } catch (err) {
      console.error('Error posting review:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  // Like review
  const handleLike = async (reviewId) => {
    if (!isLoggedIn) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/products/reviews/${reviewId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviews.map(r => r._id === reviewId ? res.data : r));
    } catch (err) {
      console.log('Error liking review:', err);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating || 0)) + '☆'.repeat(5 - Math.round(rating || 0));
  };

  return (
    <div className="container my-4">
      <div className="row">
        {/* Image Sidebar */}
        <div className="col-md-2 d-flex flex-column gap-2">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              className={`img-thumbnail ${mainImage === img ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="col-md-5">
          <img
            src={mainImage}
            alt="Selected"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Product Info */}
        <div className="col-md-5">
          <h4>Name</h4>
          <p>{product.name}</p>
          <h4>Description</h4>
          <p className="text-muted">{product.description}</p>
          <h4>Price</h4>
          <div className="d-flex align-items-center">
            <p className="fs-4 fw-bold text-success me-2">
              ${(product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2)}
            </p>
            {product.discountPercentage > 0 && (
              <p className="text-muted text-decoration-line-through">${product.price.toFixed(2)}</p>
            )}
          </div>
          {product.discountPercentage > 0 && (
            <p className="text-success">{product.discountPercentage}% Off</p>
          )}
          {product.bestseller && (
            <h4 className="fs-4 fw-bold text-success">BestSeller</h4>
          )}
          <p>Sales: {product.salesCount || 0}</p>
          <p>Reviews: {product.reviewCount || 0}</p>
          {product.rating && (
            <p className="text-warning fs-5">
              {renderStars(product.rating)} <span className="text-dark ms-2">({product.rating.toFixed(1)})</span>
            </p>
          )}
          <button
            className="btn btn-dark rounded-pill mt-3"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <hr />

      {/* Reviews */}
      <div className="mt-4">
        <h4 className="mb-3">Customer Reviews ({product.reviewCount || 0})</h4>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to write one!</p>
        ) : (
          <ul className="list-group mb-4">
            {reviews.map((review) => (
              <li key={review._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{review.username || 'Anonymous'}</strong>
                  <p className="mb-1 text-warning">{renderStars(review.rating)}</p>
                  <p className="mb-1">{review.comment}</p>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleLike(review._id)}
                  disabled={!isLoggedIn}
                >
                  👍 {review.likes?.length || 0}
                </button>
              </li>
            ))}
          </ul>
        )}

        {isLoggedIn && (
          <div>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'grey', fontSize: '1.5rem' }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea
              className="form-control"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a review..."
            />
            <button className="btn btn-primary mt-2" onClick={handleSubmitReview}>
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedPro;