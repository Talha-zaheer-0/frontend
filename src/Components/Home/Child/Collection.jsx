import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Collection.css';

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewestFilter, setIsNewestFilter] = useState(false);
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
        setFilteredProducts(allProducts); // Initialize filtered products
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error.message || error.response?.data?.message);
        setLoading(false);
      });
  }, [category, subcategory]);

  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply newest items filter
    if (isNewestFilter) {
      result = result
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by updatedAt descending
        .slice(0, 10); // Take the 10 most recent
    }

    setFilteredProducts(result);
  }, [searchQuery, products, isNewestFilter]);

  const handleSubcategoryClick = (sub) => {
    const params = new URLSearchParams(location.search);
    if (sub === 'all') {
      params.delete('subcategory');
    } else {
      params.set('subcategory', sub);
    }
    navigate(`/collection?${params.toString()}`);
  };

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

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery(''); // Clear search query when closing
    }
  };

  const toggleNewestFilter = () => {
    setIsNewestFilter(!isNewestFilter);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center mb-0">
          <span className="text-muted">Product</span> <strong>COLLECTIONS</strong>
        </h2>
        <div className="search-container">
          <FontAwesomeIcon
            icon={faSearch}
            className="search-icon"
            onClick={toggleSearchBar}
            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
          />
          {isSearchOpen && (
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>
      </div>
      <div className="row">
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
              <button
                className={`btn btn-outline-primary text-start ${isNewestFilter ? 'active' : ''}`}
                onClick={toggleNewestFilter}
              >
                Newest Items
              </button>
            </div>
          </div>
        )}
        <div className={pathname !== '/' ? 'col-md-9' : 'col-12'}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-muted">No products found.</div>
          ) : (
            <div className="row">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={product.images[0] || 'https://via.placeholder.com/250x250?text=No+Image'}
                      style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                      alt={product.name}
                      onClick={() => navigate(`/product/${product._id}`)}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="fs-6">{product.name}</Card.Title>
                      <div className="d-flex justify-content-center align-items-center mb-2">
                        <Card.Text className="fw-bold me-2">
                          ${(product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2)}
                        </Card.Text>
                        {product.discountPercentage > 0 && (
                          <Card.Text className="text-muted text-decoration-line-through">
                            ${product.price.toFixed(2)}
                          </Card.Text>
                        )}
                      </div>
                      {product.discountPercentage > 0 && (
                        <Card.Text className="text-success">{product.discountPercentage}% Off</Card.Text>
                      )}
                      <Card.Text>Reviews: {product.reviewCount || 0}</Card.Text>
                      <Button
                        variant="dark"
                        className="rounded-pill mt-2 add-card-custom"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        Add to Cart
                      </Button>
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