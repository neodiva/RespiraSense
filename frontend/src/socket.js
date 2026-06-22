import { io } from 'socket.io-client';

const socket = io('https://respirasense-backend.onrender.com', {
  autoConnect: false,
});

export default socket;