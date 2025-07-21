import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ message, variant = 'info', onClose, show }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show) {
      setProgress(100);
      const timer = setInterval(() => {
        setProgress(prev => Math.max(0, prev - (100 / 50))); // 5 seconds = 50 intervals of 100ms
      }, 100);
      const timeout = setTimeout(() => {
        onClose();
      }, 5000);
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`notification ${variant}`} style={{ position: 'fixed', top: '70px', right: '20px', zIndex: 1000 }}>
      <div className="notification-content">
        <span>{message}</span>
        <button onClick={onClose} className="notification-close">×</button>
      </div>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default Notification;