import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaBoxOpen, FaUserCircle, FaUserPlus, FaUsers } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

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
        {user?.isOwner && (
          <>
            <Link to="/admin/blockusers" className="btn btn-outline-dark d-flex align-items-center gap-2">
              <FaUserCircle /> Block User
            </Link>
            <Link to="/admin/add-child-admin" className="btn btn-outline-dark d-flex align-items-center gap-2">
              <FaUserPlus /> Add Child Admin
            </Link>
            <Link to="/admin/child-admins" className="btn btn-outline-dark d-flex align-items-center gap-2">
              <FaUsers /> Child Admins
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;