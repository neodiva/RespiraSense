const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('ROOT WORKING');
});

app.get('/hello', (req, res) => {
  res.send('HELLO');
});
app.set('io', io);

app.use('/api/readings', require('./routes/readings'));
app.use('/api/alerts',   require('./routes/alerts'));
app.use('/api/auth',     require('./routes/auth'));

app.get('/api/test', (req, res) => {
  res.json({ message: 'RespiraSense backend is running!' });
});

connectDB();

io.on('connection', (socket) => {
  console.log('🔌 Frontend connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Frontend disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));