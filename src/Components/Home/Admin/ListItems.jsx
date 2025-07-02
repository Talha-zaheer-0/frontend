import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Listitem() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
      } catch (err) {
        console.error('❌ Fetch Products Error:', err.response?.data || err.message);
        setMessage(err.response?.data?.message || '❌ Failed to fetch products.');
      }
    };

    fetchProducts();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredProducts(products); // Show all products if search is empty
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.filter(product => product._id !== id));
      setFilteredProducts(filteredProducts.filter(product => product._id !== id));
      setMessage('✅ Product deleted successfully!');
    } catch (err) {
      console.error('❌ Delete Product Error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || '❌ Failed to delete product.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Product List</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, category, or subcategory..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {message && <p className="mt-3 fw-semibold text-success">{message}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Discount (%)</th>
              <th>Sizes</th>
              <th>Bestseller</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.subcategory}</td>
                  <td>${product.price}</td>
                  <td>{product.discountPercentage}%</td>
                  <td>{product.sizes.join(', ')}</td>
                  <td>{product.bestseller ? 'Yes' : 'No'}</td>
                  <td>
                    <Link
                      to={`/admin/add-items/${product._id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Update
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}