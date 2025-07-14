import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const WomensClothingGallery = () => {
  const navigate = useNavigate();
  const [womensProducts, setWomensProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        const womenClothing = response.data
          .filter(p => p.category?.toLowerCase() === 'women')
          .slice(0, 4);
        setWomensProducts(womenClothing);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching women\'s products:', error);
        setLoading(false);
      });
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
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">
        <span className="text-muted">FEATURED</span> <strong>WOMEN'S CLOTHING</strong>
      </h2>
      <p className="text-center text-muted">
        Shop the latest in women’s fashion and style.
      </p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {womensProducts.length === 0 ? (
            <div className="text-center text-muted">No women's products found.</div>
          ) : (
            womensProducts.map((item, index) => (
              <div key={item._id || index} className="col-md-3 col-sm-6 mb-4">
                <Card className="h-100 shadow-sm d-flex flex-column">
                  <Card.Img
                    variant="top"
                    src={item.images?.[0] || 'https://via.placeholder.com/250x250?text=No+Image'}
                    style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                    alt={item.name}
                    onClick={() => navigate(`/product/${item._id}`)}
                  />
                  <Card.Body className="text-center d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="fs-6 mb-2">{item.name}</Card.Title>
                      <div className="d-flex justify-content-center align-items-center mb-2">
                        <Card.Text className="fw-bold me-2">
                          ${(item.price * (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}
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
                      {/* <Card.Text>Reviews: {item.reviewCount || 0}</Card.Text> */}
                    </div>
                    <Button
                      variant="dark"
                      className="rounded-pill mt-2"
                      onClick={() => handleAddToCart(item._id)}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && womensProducts.length > 0 && (
        <div className="text-center mt-4">
          <Link to="/collection?category=Women">
            <Button variant="dark" className="rounded-pill px-4 py-2">
              See All
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WomensClothingGallery;