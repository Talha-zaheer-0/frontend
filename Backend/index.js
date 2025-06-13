const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/auth/', apiLimiter);

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, role, adminAccess } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    if (role === 'admin' && !adminAccess) {
      return res.status(400).json({ message: 'Admin access level required' });
    }
    // Simulate signup (replace with database logic)
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route (fixes 404)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    // Simulate login (replace with authentication logic)
    res.status(200).json({ message: 'Login successful', token: 'dummy-token' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

server.listen(5000, () => console.log('Server running on http://localhost:5000'));