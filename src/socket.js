import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['polling', 'websocket'], // Start with polling, upgrade to websocket
  reconnection: true,
  reconnectionAttempts: 5, // Limit reconnection attempts
  reconnectionDelay: 1000, // Delay between retries
  withCredentials: true, // Include cookies if needed
});

// Log connection events
socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('Socket.IO connection error:', err.message);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from Socket.IO server:', reason);
});

export default socket;