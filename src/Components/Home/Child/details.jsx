import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import styles from './detail.module.css';
import Notification from '../Notification';

const DetailedPro = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState('');
  const [productComments, setProductComments] = useState([]);
  const [comment, setComment] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProductCommentBox, setShowProductCommentBox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLiking, setIsLiking] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const carouselRef = useRef(null);
  const imageRef = useRef(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [flashCommentId, setFlashCommentId] = useState(null);

  const renderStars = (rating, interactive = false, onStarClick = () => {}) => {
    const starRating = Math.round(rating || 0);
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`${styles.star} ${i < starRating ? styles.filled : styles.empty}`}
        onClick={interactive ? () => onStarClick(i + 1) : undefined}
        style={interactive ? { cursor: 'pointer' } : {}}
      >
        ★
      </span>
    ));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    setIsLoggedIn(!!token);
    const effectiveUserId = storedUserId || user?._id?.toString() || null;
    setCurrentUserId(effectiveUserId);
    console.log('useEffect: Current user ID:', effectiveUserId, { fromLocalStorage: storedUserId, fromAuthContext: user?._id });

    if (!productId) return;

    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(res => {
        const data = res.data || {};
        setProduct(data);
        setMainImage(data.images?.[0] || '');
        setAverageRating(parseFloat(data.averageRating) || 0);
        setReviewCount(data.reviewCount || 0);
      })
      .catch(err => {
        console.error('Error loading product:', err);
        setNotificationMessage('Failed to load product details.');
        setShowNotification(true);
      });

    axios.get(`http://localhost:5000/api/products/comments/${productId}`)
      .then(res => {
        const data = (res.data || []).map(comment => ({
          ...comment,
          likes: Array.isArray(comment.likes) ? comment.likes.filter(id => id != null).map(id => id.toString()) : [],
        }));
        console.log('useEffect: Fetched comments:', data);
        setProductComments(data);
      })
      .catch(err => {
        console.error('Error loading product comments:', err);
        setNotificationMessage('Failed to load comments.');
        setShowNotification(true);
      });

    if (token && effectiveUserId) {
      axios.get(`http://localhost:5000/api/products/rating/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setUserRating(res.data.userRating);
          setAverageRating(parseFloat(res.data.averageRating) || 0);
          setReviewCount(res.data.reviewCount || 0);
        })
        .catch(err => {
          console.error('Error loading user rating:', err);
          setNotificationMessage('Failed to load your rating.');
          setShowNotification(true);
        });
    }

    axios.get(`http://localhost:5000/api/products?category=${encodeURIComponent(product.category)}`)
      .then(res => {
        const data = res.data || [];
        const filtered = data
          .filter(p => p._id !== productId)
          .slice(0, 16)
          .map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            salePrice: p.price * (1 - (p.discountPercentage || 0) / 100),
            image: p.images?.[0] || '/placeholder.jpg',
            discountPercentage: p.discountPercentage || 0,
          }));
        setRelatedProducts(filtered);
      })
      .catch(err => {
        console.error('Error loading related products:', err);
        setNotificationMessage('Failed to load related products.');
        setShowNotification(true);
      });

    console.log('useEffect: Product category for related products:', product.category);
  }, [productId, product.category, user]);

  useEffect(() => {
    if (flashCommentId) {
      const timer = setTimeout(() => setFlashCommentId(null), 500);
      return () => clearTimeout(timer);
    }
  }, [flashCommentId]);

  const handleAddToCart = async () => {
    if (!isLoggedIn || !currentUserId) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/products/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificationMessage('Product added to cart!');
      setShowNotification(true);
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message);
      setNotificationMessage('Failed to add product to cart: ' + (err.response?.data?.message || 'Server error'));
      setShowNotification(true);
    }
  };

  const handleSubmitComment = async (parentId, isReply = false) => {
    if (!isLoggedIn || !currentUserId) {
      setNotificationMessage('Please log in to comment');
      setShowNotification(true);
      return;
    }

    if (!comment.trim() && !isReply || (isReply && !replyText.trim())) {
      setNotificationMessage('Please enter a comment');
      setShowNotification(true);
      return;
    }

    const formData = new FormData();
    if (isReply) {
      formData.append('commentId', parentId);
      formData.append('reply', replyText);
      if (replyImage) formData.append('image', replyImage);
    } else {
      formData.append('productId', productId);
      formData.append('text', comment);
      if (commentImage) formData.append('image', commentImage);
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = isReply ? 'review/reply' : 'product-comment';
      const res = await axios.post(
        `http://localhost:5000/api/products/${endpoint}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      if (isReply) {
        setProductComments(prevComments =>
          prevComments.map(c =>
            c._id === parentId
              ? { ...c, replies: [...(c.replies || []), { ...res.data, userId: currentUserId, username: user?.name || 'Anonymous' }] }
              : c
          )
        );
      } else {
        setProductComments(prevComments => [{ ...res.data, userId: currentUserId, username: user?.name || 'Anonymous', likes: [] }, ...prevComments]);
      }
      setComment('');
      setCommentImage(null);
      setReplyText('');
      setReplyImage(null);
      setSelectedCommentId(null);
      setShowProductCommentBox(false);
      setNotificationMessage(isReply ? 'Reply submitted successfully!' : 'Comment submitted successfully!');
      setShowNotification(true);
    } catch (err) {
      console.error('Error posting comment/reply:', err.response?.data || err.message);
      setNotificationMessage('Failed to submit comment/reply: ' + (err.response?.data?.message || 'Server error'));
      setShowNotification(true);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isLoggedIn || !currentUserId) {
      setNotificationMessage('Please log jąin to like a comment');
      setShowNotification(true);
      return;
    }

    if (isLiking[commentId]) return;

    setIsLiking(prev => ({ ...prev, [commentId]: true }));

    // Optimistic UI update
    setProductComments(prevComments =>
      prevComments.map(c =>
        c._id === commentId
          ? {
              ...c,
              likes: Array.isArray(c.likes)
                ? c.likes
                    .filter(id => id != null)
                    .map(id => id.toString())
                    .includes(currentUserId)
                  ? c.likes.filter(id => id == null || id.toString() !== currentUserId)
                  : [...c.likes.filter(id => id != null), currentUserId]
                : [currentUserId],
            }
          : c
      )
    );

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/products/comment/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Like response:', res.data);

      // Update with backend response
      setProductComments(prevComments =>
        prevComments.map(c =>
          c._id === commentId
            ? {
                ...c,
                likes: Array.isArray(res.data.likes)
                  ? res.data.likes.filter(id => id != null).map(id => id.toString())
                  : [],
              }
            : c
        )
      );
      setFlashCommentId(commentId);
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err.message);
      setNotificationMessage('Failed to toggle like: ' + (err.response?.data?.message || 'Server error'));
      setShowNotification(true);

      // Rollback optimistic update on error
      setProductComments(prevComments =>
        prevComments.map(c =>
          c._id === commentId
            ? {
                ...c,
                likes: Array.isArray(c.likes)
                  ? c.likes
                      .filter(id => id != null)
                      .map(id => id.toString())
                      .includes(currentUserId)
                    ? c.likes.filter(id => id == null || id.toString() !== currentUserId)
                    : [...c.likes.filter(id => id != null), currentUserId]
                  : [currentUserId],
              }
            : c
        )
      );

      // Fallback: Re-fetch comments
      try {
        const commentsRes = await axios.get(`http://localhost:5000/api/products/comments/${productId}`);
        const sanitizedComments = (commentsRes.data || []).map(comment => ({
          ...comment,
          likes: Array.isArray(comment.likes) ? comment.likes.filter(id => id != null).map(id => id.toString()) : [],
        }));
        setProductComments(sanitizedComments);
        console.log('Re-fetched comments:', sanitizedComments);
      } catch (fetchErr) {
        console.error('Error re-fetching comments:', fetchErr);
      }
    } finally {
      setIsLiking(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleRateProduct = async (rating) => {
    if (!isLoggedIn || !currentUserId) {
      setNotificationMessage('Please log in to rate');
      setShowNotification(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/products/rating`,
        { productId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRating(rating);
      setAverageRating(parseFloat(res.data.averageRating) || 0);
      setReviewCount(res.data.reviewCount || 0);
      setNotificationMessage(res.data.message);
      setShowNotification(true);
    } catch (err) {
      console.error('Error submitting rating:', err.response?.data || err.message);
      setNotificationMessage('Failed to submit rating: ' + (err.response?.data?.message || 'Server error'));
      setShowNotification(true);
    }
  };

  const handleImageClick = (imageUrl) => {
    if (imageUrl && imageUrl !== '/placeholder.jpg') {
      setSelectedImage(imageUrl);
    }
  };

  const closePopup = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector(`.${styles.relatedCard}`);
      if (card) {
        const cardWidth = card.offsetWidth + 20;
        carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector(`.${styles.relatedCard}`);
      if (card) {
        const cardWidth = card.offsetWidth + 20;
        carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imgWidth = rect.width;
    const imgHeight = rect.height;

    const magnifierSize = 100;
    const zoomLevel = 2;

    const halfMagnifier = magnifierSize / 2;
    const boundedX = Math.max(halfMagnifier, Math.min(x, imgWidth - halfMagnifier));
    const boundedY = Math.max(halfMagnifier, Math.min(y, imgHeight - halfMagnifier));

    const bgX = -((boundedX - halfMagnifier) * zoomLevel);
    const bgY = -((boundedY - halfMagnifier) * zoomLevel);

    setMagnifierPosition({ x: boundedX - halfMagnifier, y: boundedY - halfMagnifier });
    setBackgroundPosition({ x: bgX, y: bgY });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
            <img
              ref={imageRef}
              src={mainImage || '/placeholder.jpg'}
              alt="Product"
              className={styles.mainImage}
            />
            {showMagnifier && mainImage && mainImage !== '/placeholder.jpg' && (
              <div
                className={styles.magnifier}
                style={{
                  left: `${magnifierPosition.x}px`,
                  top: `${magnifierPosition.y}px`,
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: `${imageRef.current?.width * 2}px ${imageRef.current?.height * 2}px`,
                  backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
                }}
              />
            )}
          </div>
          <div className={styles.thumbnailContainer}>
            {product.images?.length > 0 ? (
              product.images.map((img, i) => (
                <img
                  key={i}
                  src={img || '/placeholder.jpg'}
                  alt={`thumb-${i}`}
                  className={`${styles.thumbnail} ${mainImage === img ? styles.active : ''}`}
                  onClick={() => setMainImage(img)}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name || 'No name available'}</h1>
          <p className="text-muted">{product.description || 'No description available'}</p>
          <div className="d-flex align-items-center mb-2">
            <p className="fs-4 fw-bold text-success me-2">
              ${(product.price * (1 - (product.discountPercentage || 0) / 100) || 0).toFixed(2)}
            </p>
            {product.discountPercentage > 0 && (
              <p className="text-muted text-decoration-line-through">${(product.price || 0).toFixed(2)}</p>
            )}
          </div>
          {product.discountPercentage > 0 && (
            <p className="text-success">{product.discountPercentage}% Off</p>
          )}
          {product.bestseller && (
            <p className="text-success fw-bold">Best Seller</p>
          )}
          <p>Sales: {product.salesCount || 0}</p>
          <p>Reviews: {reviewCount}</p>
          <div className={styles.starRating}>
            {renderStars(averageRating)}
            <span className={styles.ratingText}>({averageRating.toFixed(1)})</span>
          </div>
          {isLoggedIn && (
            <div className="mt-2">
              <p>Your Rating:</p>
              <div className={styles.starRating}>
                {renderStars(userRating || 0, true, handleRateProduct)}
              </div>
            </div>
          )}
          <div className="d-flex align-items-center mt-3">
            <button
              className={styles.quantityButton}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              className={styles.input}
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button
              className={styles.quantityButton}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
            <button
              className={styles.buttonPrimary}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <hr />

      <div className={styles.reviewSection}>
        <h4>Product Comments ({productComments.length})</h4>
        {isLoggedIn && (
          <div className="mb-3">
            <button
              className={styles.buttonSecondary}
              onClick={() => {
                setShowProductCommentBox(!showProductCommentBox);
                setComment('');
                setCommentImage(null);
              }}
            >
              {showProductCommentBox ? 'Cancel' : 'Add Comment'}
            </button>
            {showProductCommentBox && (
              <div className="mt-2">
                <textarea
                  className={styles.textarea}
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a new comment for the product..."
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={(e) => setCommentImage(e.target.files[0])}
                />
                <button
                  className={styles.buttonPrimary}
                  onClick={() => handleSubmitComment(null, false)}
                  disabled={!comment.trim()}
                >
                  Submit Comment
                </button>
              </div>
            )}
          </div>
        )}
        {productComments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        ) : (
          <div>
            {productComments.slice(0, showAllComments ? productComments.length : 3).map((comment) => (
              <div key={comment._id} className={styles.reviewItem}>
                <div>
                  <strong>{comment.username || 'Anonymous'}</strong>
                  <p className="mb-1">{comment.text || 'No text'}</p>
                  {comment.image && (
                    <img
                      src={comment.image}
                      alt={`Comment by ${comment.username || 'Anonymous'}`}
                      className={styles.commentImage}
                      onClick={() => handleImageClick(comment.image)}
                      onError={(e) => { e.target.src = '/placeholder.jpg'; console.error('Image load error:', comment.image); }}
                    />
                  )}
                  {console.log(`Comment ${comment._id} likes:`, comment.likes, 'User ID:', currentUserId)}
                </div>
                {isLoggedIn && (
                  <div className="mt-2 d-flex gap-2 align-items-center">
                    <span
                      className={styles.replyLink}
                      onClick={() => {
                        setSelectedCommentId(selectedCommentId === comment._id ? null : comment._id);
                        setReplyText('');
                        setReplyImage(null);
                      }}
                    >
                      reply
                    </span>
                    <span
                      className={`${styles.likeIcon} ${
                        Array.isArray(comment.likes) && comment.likes.filter(id => id != null).map(id => id.toString()).includes(currentUserId)
                          ? styles.liked
                          : ''
                      } ${flashCommentId === comment._id ? styles.flash : ''}`}
                      onClick={() => handleLikeComment(comment._id)}
                      style={{ cursor: isLiking[comment._id] ? 'not-allowed' : 'pointer' }}
                    >
                      <FontAwesomeIcon
                        icon={
                          Array.isArray(comment.likes) && comment.likes.filter(id => id != null).map(id => id.toString()).includes(currentUserId)
                            ? faHeartSolid
                            : faHeartRegular
                        }
                      />
                      <span className={styles.likeCount}>{comment.likes?.length || 0}</span>
                    </span>
                  </div>
                )}
                {selectedCommentId === comment._id && (
                  <div className="mt-2">
                    <textarea
                      className={styles.textarea}
                      rows="2"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <input
                      type="file"
                      className="form-control mb-2"
                      accept="image/*"
                      onChange={(e) => setReplyImage(e.target.files[0])}
                    />
                    <button
                      className={styles.buttonPrimary}
                      onClick={() => handleSubmitComment(comment._id, true)}
                      disabled={!replyText.trim()}
                    >
                      Submit Reply
                    </button>
                  </div>
                )}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2">
                    <button
                      className={styles.viewRepliesButton}
                      onClick={() => toggleReplies(comment._id)}
                    >
                      {showReplies[comment._id] ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
                    </button>
                    {showReplies[comment._id] && (
                      <div className="mt-2">
                        {comment.replies.map((reply, rIndex) => (
                          <div key={rIndex} className="ms-4 mt-2 p-2 border rounded">
                            <p><strong>{reply.username || 'Anonymous'}:</strong> {reply.text || 'No text'}</p>
                            {reply.image && (
                              <img
                                src={reply.image}
                                alt={`Reply by ${reply.username || 'Anonymous'}`}
                                className={styles.commentImage}
                                onClick={() => handleImageClick(reply.image)}
                                onError={(e) => { e.target.src = '/placeholder.jpg'; console.error('Image load error:', reply.image); }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {productComments.length > 3 && (
              <button
                className={styles.buttonSecondary}
                onClick={() => setShowAllComments(!showAllComments)}
              >
                {showAllComments ? 'Show Less' : 'See More Comments'}
              </button>
            )}
          </div>
        )}
      </div>

      <hr />

      <div className={styles.relatedProductsSection}>
        <h4>Related Products</h4>
        {relatedProducts.length === 0 ? (
          <p className="text-muted">No related products found.</p>
        ) : (
          <div className={styles.carouselContainer}>
            <button
              className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
              onClick={scrollLeft}
            >
              {"<"}
            </button>
            <div className={styles.carousel} ref={carouselRef}>
              <div className={styles.carouselRow}>
                {relatedProducts.map((item) => (
                  <div key={item.id} className={styles.relatedCard}>
                    <div className={styles.relatedCardContent}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.relatedImage}
                        onClick={() => navigate(`/product/${item.id}`)}
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                      <div className={styles.relatedPrice}>
                        ${item.salePrice.toFixed(2)}
                        {item.discountPercentage > 0 && (
                          <span className={styles.relatedDiscount}>
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
              onClick={scrollRight}
            >
              {">"}
            </button>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closePopup}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90vh',
              background: '#fff',
              padding: '10px',
              borderRadius: '8px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Popup Image"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
              onError={(e) => { e.target.src = '/placeholder.jpg'; console.error('Popup image load error:', selectedImage); }}
            />
            <button
              onClick={closePopup}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: '28px',
              }}
            >
              ×
            </button>
          </div>
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
};

export default DetailedPro;