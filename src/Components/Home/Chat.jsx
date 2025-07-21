import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';

const Chat = () => {
  const { orderId } = useParams(); // Assume orderId is passed via route (e.g., /chat/:orderId)
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    const socketInstance = io('http://localhost:5000', {
      auth: { token: `Bearer ${token}` },
    });

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socketInstance.emit('join-order-chat', { orderId, userId: user._id });
    });

    socketInstance.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [orderId, user]);

  // Fetch initial chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err.response?.data || err.message);
        setLoading(false);
      }
    };
    fetchMessages();
  }, [orderId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      orderId,
      userId: user._id,
      message: newMessage,
      senderType: 'user',
      timestamp: new Date(),
    };

    try {
      socket.emit('send-message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center my-5 text-danger">Please log in to chat.</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Chat about Order #{orderId}</h2>
      <div className="card shadow-sm">
        <div
          className="card-body"
          style={{ maxHeight: '400px', overflowY: 'auto', padding: '20px' }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 d-flex ${
                msg.senderType === 'user' ? 'justify-content-end' : 'justify-content-start'
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.senderType === 'user' ? 'bg-primary text-white' : 'bg-light'
                }`}
                style={{ maxWidth: '70%' }}
              >
                <p className="mb-1">{msg.message}</p>
                <small className="text-muted">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer">
          <form onSubmit={handleSendMessage} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!socket}
            />
            <button
              type="submit"
              className="btn btn-dark"
              disabled={!newMessage.trim() || !socket}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;