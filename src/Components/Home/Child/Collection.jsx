import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const subcategory = queryParams.get('subcategory');
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        let allProducts = response.data;
        if (category) {
          allProducts = allProducts.filter(
            p => p.category.toLowerCase() === category.toLowerCase()
          );
        }
        if (subcategory) {
          allProducts = allProducts.filter(
            p => p.subcategory.toLowerCase() === subcategory.toLowerCase()
          );
        }
        setProducts(allProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error.message || error.response?.data?.message);
        setLoading(false);
      });
  }, [category, subcategory]);
  const handleSubcategoryClick = (sub) => {
    const params = new URLSearchParams(location.search);
    if (sub === 'all') {
      params.delete('subcategory');
    } else {
      params.set('subcategory', sub);
    }
    navigate(`/collection?${params.toString()}`);
  };
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">
        <span className="text-muted">Product</span> <strong>COLLECTIONS</strong>
      </h2>
      <div className="row">
        {/* :white_check_mark: Sidebar only shows if not on homepage */}
        {pathname !== '/' && (
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Shop by Style</h5>
            <div className="btn-group-vertical w-100" role="group" aria-label="Subcategory filters">
              <button
                className={`btn btn-outline-primary text-start ${!subcategory ? 'active' : ''}`}
                onClick={() => handleSubcategoryClick('all')}
              >
                All
              </button>
              <button
                className={`btn btn-outline-primary text-start ${subcategory === 'topwear' ? 'active' : ''}`}
                onClick={() => handleSubcategoryClick('topwear')}
              >
                Topwear
              </button>
              <button
                className={`btn btn-outline-primary text-start ${subcategory === 'footwear' ? 'active' : ''}`}
                onClick={() => handleSubcategoryClick('footwear')}
              >
                Footwear
              </button>
              <button
                className={`btn btn-outline-primary text-start ${subcategory === 'bottomwear' ? 'active' : ''}`}
                onClick={() => handleSubcategoryClick('bottomwear')}
              >
                Bottomwear
              </button>
            </div>
          </div>
        )}
        {/* Product Grid */}
        <div className={pathname !== '/' ? 'col-md-9' : 'col-12'}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted">No products found.</div>
          ) : (
            <div className="row">
              {products.map((product) => (
                <div key={product._id?.$oid || product._id} onClick={() => navigate(`/product/${product._id}`)} className="col-md-4 mb-4">
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductGallery;