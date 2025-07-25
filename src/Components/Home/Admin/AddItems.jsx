import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddItems() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Men',
    subcategory: 'Topwear',
    price: '',
    discountPercentage: '',
    sizes: [],
    bestseller: false,
  });
  const [images, setImages] = useState([]); // New uploads
  const [previewUrls, setPreviewUrls] = useState([]); // All images for display
  const [existingImages, setExistingImages] = useState([]); // Existing Cloudinary images
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false); // Added for loader
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const product = response.data;
          setFormData({
            name: product.name,
            description: product.description || '',
            category: product.category,
            subcategory: product.subcategory,
            price: product.price,
            discountPercentage: product.discountPercentage || '',
            sizes: product.sizes || [],
            bestseller: product.bestseller,
          });
          setPreviewUrls(product.images || []);
          setExistingImages(product.images || []);
          console.log('Fetched product images:', product.images);
        } catch (err) {
          console.error('❌ Fetch Product Error:', err.response?.data || err.message);
          setMessage(err.response?.data?.message || '❌ Failed to fetch product.');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      alert('You can upload a maximum of 4 images.');
      return;
    }
    setImages(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    console.log('New images added:', files.map(f => f.name));
  };

  const handleRemoveImage = (index) => {
    const urlToRemove = previewUrls[index];
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    if (urlToRemove.startsWith('blob:')) {
      // Remove from new images
      setImages(prev => prev.filter((_, i) => i !== prev.length - (previewUrls.length - index)));
    } else {
      // Remove from existing images
      setExistingImages(prev => prev.filter(url => url !== urlToRemove));
    }
    console.log('Removed image at index:', index, 'URL:', urlToRemove);
    console.log('Updated existingImages:', existingImages.filter(url => url !== urlToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (previewUrls.length < 1) {
      setMessage('❌ Please upload at least 1 image.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ Please log in as admin to add/update products.');
      return;
    }

    setSubmitting(true); // Start loader
    const data = new FormData();
    images.forEach(img => data.append('images', img));
    existingImages.forEach(url => data.append('existingImages', url));
    for (let key in formData) {
      if (key === 'sizes') {
        formData.sizes.forEach(size => data.append('sizes', size));
      } else {
        data.append(key, formData[key]);
      }
    }

    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const url = id ? `http://localhost:5000/api/products/${id}` : 'http://localhost:5000/api/products/add';
      const method = id ? 'put' : 'post';
      const res = await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(id ? '✅ Product updated successfully!' : '✅ Product added successfully!');
      setFormData({
        name: '',
        description: '',
        category: 'Men',
        subcategory: 'Topwear',
        price: '',
        discountPercentage: '',
        sizes: [],
        bestseller: false,
      });
      setImages([]);
      setPreviewUrls([]);
      setExistingImages([]);
      navigate('/admin/list-items');
    } catch (err) {
      console.error('❌ Axios error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || `❌ Failed to ${id ? 'update' : 'add'} product.`);
    } finally {
      setSubmitting(false); // Stop loader
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">{id ? 'Update Product' : 'Upload Product'}</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="d-flex gap-2 mt-2 flex-wrap">
            {previewUrls.map((url, i) => (
              <div key={i} className="position-relative">
                <img src={url} alt="preview" width="70" height="70" style={{ objectFit: 'cover', borderRadius: 5 }} />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  style={{ transform: 'translate(50%, -50%)' }}
                  onClick={() => handleRemoveImage(i)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Product name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">Product category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Sub category</label>
            <select
              name="subcategory"
              className="form-select"
              value={formData.subcategory}
              onChange={handleInputChange}
            >
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Footwear</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Product Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Discount Percentage (0-100)</label>
          <input
            type="number"
            className="form-control"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleInputChange}
            min="0"
            max="100"
            placeholder="Enter discount percentage"
          />
        </div>

        <div className="mb-3">
          <label className="form-label d-block">Product Sizes</label>
          <div className="btn-group">
            {sizeOptions.map(size => (
              <button
                type="button"
                key={size}
                className={`btn btn-outline-primary ${formData.sizes.includes(size) ? 'active' : ''}`}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="bestseller"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="bestseller">
            Add to bestseller
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-dark px-4 d-flex align-items-center"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Processing...
            </>
          ) : (
            id ? 'Update' : 'Add'
          )}
        </button>
        {message && (
          <p className={`mt-3 fw-semibold ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}