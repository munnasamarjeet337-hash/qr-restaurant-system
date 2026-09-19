import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const getSocketServerUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    if (window.location.port === '5173' || window.location.port === '3000') {
      return `http://${hostname}:5000`;
    }
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const currentRoomsRef = useRef(new Set());

  useEffect(() => {
    const serverUrl = getSocketServerUrl();
    console.log(`[Socket] Connecting to server at: ${serverUrl}`);

    const socketInstance = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketInstance.on('connect', () => {
      console.log(`[Socket] Connected with ID: ${socketInstance.id}`);
      setIsConnected(true);

      // Rejoin rooms on reconnect
      currentRoomsRef.current.forEach((room) => {
        socketInstance.emit('join_room', { room });
      });
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn(`[Socket] Connection error:`, err.message);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinRoom = (roomName) => {
    if (!roomName) return;
    currentRoomsRef.current.add(roomName);
    if (socket && socket.connected) {
      socket.emit('join_room', { room: roomName });
      console.log(`[SocketContext] Requested join room: ${roomName}`);
    }
  };

  const leaveRoom = (roomName) => {
    if (!roomName) return;
    currentRoomsRef.current.delete(roomName);
    if (socket && socket.connected) {
      socket.emit('leave_room', roomName);
      console.log(`[SocketContext] Requested leave room: ${roomName}`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
