import React, { createContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

type SocketProviderProps = {
  children: React.ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  
  useEffect(() => {
    const socketInstance = io('http://localhost:8001', {
      withCredentials: true,
      autoConnect: false,
    });

    socketInstance.connect();
    setSocket(socketInstance);
  
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
