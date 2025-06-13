require('dotenv').config();
let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('error', (err) => console.error('Socket error:', err));
    socket.on('disconnect', () => console.log('User disconnected'));
  });
};

const emitNotification = (event, message, userId) => {
  if (io && userId) {
    io.to(userId).emit(event, message);
  } else if (io) {
    io.emit(event, message);
  }
};

module.exports = { initSocket, emitNotification };