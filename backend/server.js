const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket connection
io.on('connection', (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Make io available in routes
app.set('io', io);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected Successfully");

  server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });

})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err.message);
});