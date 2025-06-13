import React, { createContext, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { getSocket } from 'src/lib/socket';

export const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

type SocketProviderProps = {
  children: React.ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  
  useEffect(() => {
    const socketInstance = getSocket();
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
