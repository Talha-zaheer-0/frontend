import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetailedPro = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
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

    axios.get(`http://localhost:5000/api/reviews/${productId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.log('Error loading reviews:', err));
  }, [productId]);

  // Submit review
  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token');
    if (!comment.trim() || !token) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/reviews/${productId}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([res.data, ...reviews]);
      setComment('');
    } catch (err) {
      console.log('Error posting review:', err);
    }
  };

  // Like review
  const handleLike = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/reviews/${reviewId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviews.map(r => r._id === reviewId ? res.data : r));
    } catch (err) {
      console.log('Error liking review:', err);
    }
  };

  // Render star rating (rounded)
  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
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
          <p className="">{product.name}</p>
          <h4>Description</h4>
          <p className="text-muted">{product.description}</p>
          <h4>Price</h4>
          <p className="fs-4 fw-bold text-success">${product.price}</p>
          {product.bestseller ?<div>
          <h4 className='fs-4 fw-bold text-success'>BestSeller</h4>
          </div>: null}

          {product.rating && (
            <p className="text-warning fs-5">
              {renderStars(product.rating)} <span className="text-dark ms-2">({product.rating.toFixed(1)})</span>
            </p>
          )}
        </div>
      </div>

      <hr />

      {/* Reviews */}
      <div className="mt-4">
        <h4 className="mb-3">Customer Reviews</h4>

        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to write one!</p>
        ) : (
          <ul className="list-group mb-4">
            {reviews.map((review) => (
              <li key={review._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{review.username || 'Anonymous'}</strong>
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

        {/* Add Review */}
        {isLoggedIn && (
          <div>
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
