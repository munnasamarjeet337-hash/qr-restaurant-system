import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import QRCode from 'qrcode';

import menuRoutes from './routes/menuRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { registerSocketHandlers } from './sockets/socketHandlers.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Socket.io initialization with open CORS for local network and mobile devices
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: false
  }
});

// Attach io to Express app for use in controllers
app.set('io', io);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(morgan('dev'));

// Register Socket.io handlers
registerSocketHandlers(io);

// REST API routes
app.use('/api', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);

// QR Code generation API endpoint (supports 1 Universal QR or specific tables)
app.get('/api/qr/generate', async (req, res) => {
  try {
    const { url, table } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 450,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    });
    res.json({ success: true, table: table || null, url, qrCode: qrDataUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ success: false, message: 'Failed to generate QR code', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'QR Restaurant Ordering & Realtime Receptionist System',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Listen on 0.0.0.0 to enable mobile phones on Wi-Fi/LAN to connect
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Restaurant Server & Socket.io running on http://0.0.0.0:${PORT}`);
});

export { app, server, io };
