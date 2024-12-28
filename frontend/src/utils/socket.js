import io from 'socket.io-client';

const getSocketUrl = () => {
  // For local development on same machine
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  // For local network access (mobile testing)
  return 'http://192.168.29.10:5000';
};

const socket = io(getSocketUrl(), {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // You could show a toast notification here
});

socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
});

export const getSocketConnectionStatus = () => socket.connected;
export default socket;