import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Spinner, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MensClothingGallery = () => {
  const navigate = useNavigate();
  const [mensProducts, setMensProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        const menClothing = response.data
          .filter(p => p.category?.toLowerCase() === 'men')
          .slice(0, 4); // ✅ Only 4 items shown
        setMensProducts(menClothing);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching men\'s products:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">
        <span className="text-muted">TRENDING</span> <strong>MEN'S CLOTHING</strong>
      </h2>
      <p className="text-center text-muted">
        Discover the latest trends in men's fashion.
      </p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {mensProducts.length === 0 ? (
            <div className="text-center text-muted">No men's products found.</div>
          ) : (
            mensProducts.map((item, index) => (
              <div key={item._id || index} className="col-md-3 col-sm-6 mb-4" onClick={() => navigate(`/product/${item._id}`)}>
                <Card className="h-100 shadow-sm d-flex flex-column">
                  <Card.Img
                    variant="top"
                    src={item.images?.[0] || 'https://via.placeholder.com/250x250?text=No+Image'}
                    style={{ height: '250px', objectFit: 'cover' }}
                    alt={item.name}
                  />
                  <Card.Body className="text-center d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="fs-6 mb-2">{item.name}</Card.Title>
                      <Card.Text className="fw-bold mb-3">${item.price.toFixed(2)}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </div>
      )}

      {/* ✅ See All Button */}
      {!loading && mensProducts.length > 0 && (
        <div className="text-center mt-4">
          <Link to="/collection?category=Men">
            <Button variant="dark" className="rounded-pill px-4 py-2">
              See All
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MensClothingGallery;

