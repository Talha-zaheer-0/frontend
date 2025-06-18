import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaBoxOpen } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div>
      <div className="d-grid gap-3">
        <Link to="/admin/add-items" className="btn btn-outline-dark d-flex align-items-center gap-2">
          <FaPlus /> Add Items
        </Link>
        <Link to="/admin/list-items" className="btn btn-outline-dark d-flex align-items-center gap-2">
          <FaClipboardList /> List Items
        </Link>
        <Link to="/admin/orders" className="btn btn-outline-dark d-flex align-items-center gap-2">
          <FaBoxOpen /> Orders
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

