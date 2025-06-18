import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error.message || error.response?.data?.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">
        <span className="text-muted">Product</span> <strong>COLLECTIONS</strong>
      </h2>
      <p className="text-center text-muted">
        Explore our latest collection of premium quality products.
      </p>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {products.length === 0 ? (
            <div className="col-md-3 col-sm-6 mb-4">
              <Card
                className="add-card-custom shadow-sm border-0 d-flex align-items-center justify-content-center"
                style={{ height: '250px', backgroundColor: '#f0f0f0' }}
              >
                <div className="text-center">
                  <FaPlus size={36} className="text-secondary" />
                  <p className="mt-2 text-secondary">Add Product</p>
                </div>
              </Card>
            </div>
          ) : (
            products.map((product, index) => (
              <div key={index} className="col-md-3 col-sm-6 mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={product.images[0] || 'https://via.placeholder.com/250x250?text=No+Image'}
                    style={{ height: '250px', objectFit: 'cover' }}
                    alt={product.name}
                  />
                  <Card.Body className="text-center">
                    <Card.Title className="fs-6">{product.name}</Card.Title>
                    <Card.Text className="fw-bold">${product.price.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;