import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Confirmation</h2>
        <p className="text-gray-600">No order details available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Confirmation</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Thank you for your order!</h3>
        <p className="text-gray-600 mb-4">Order ID: {order.orderId}</p>
        <p className="text-gray-600 mb-4">Delivery Address: {order.deliveryAddress}</p>
        <p className="text-gray-600 mb-4">Phone: {order.phone}</p>
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Order Items</h4>
        {order.items.map((item) => (
          <div key={item.productId._id} className="flex items-center mb-4 border-b pb-4">
            <img
              src={item.productId.images[0]}
              alt={item.productId.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.productId.name}</p>
              <p className="text-gray-600">${item.price} x {item.quantity}</p>
            </div>
            <p className="text-gray-800 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="text-right">
          <p className="text-xl font-bold text-gray-800">Total: ${order.totalAmount.toFixed(2)}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;