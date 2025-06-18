import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddItems() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Men',
    subcategory: 'Topwear',
    price: '',
    sizes: [],
    bestseller: false,
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState('');

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) return alert("You can upload a maximum of 4 images.");
    setImages(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 1) return alert("Please upload at least 1 image.");

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("❌ Please log in as admin to add products.");
      return;
    }

    const data = new FormData();
    images.forEach(img => data.append("images", img));
    for (let key in formData) {
      if (key === "sizes") {
        formData.sizes.forEach(size => data.append("sizes", size));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/products/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage("✅ Product added successfully!");
      setFormData({
        name: '',
        description: '',
        category: 'Men',
        subcategory: 'Topwear',
        price: '',
        sizes: [],
        bestseller: false
      });
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error('❌ Axios error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Failed to upload product.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Upload Product</h2>
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
              <img key={i} src={url} alt="preview" width="70" height="70" style={{ objectFit: 'cover', borderRadius: 5 }} />
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Product name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Product description</label>
          <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleInputChange} />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label">Product category</label>
            <select name="category" className="form-select" value={formData.category} onChange={handleInputChange}>
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Sub category</label>
            <select name="subcategory" className="form-select" value={formData.subcategory} onChange={handleInputChange}>
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Footwear</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Product Price</label>
            <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label d-block">Product Sizes</label>
          <div className="btn-group" role="group">
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
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
          <input type="checkbox" className="form-check-input" id="bestseller" name="bestseller" checked={formData.bestseller} onChange={handleInputChange} />
          <label className="form-check-label" htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type="submit" className="btn btn-dark px-4">ADD</button>
        {message && <p className="mt-3 fw-semibold text-success">{message}</p>}
      </form>
    </div>
  );
}