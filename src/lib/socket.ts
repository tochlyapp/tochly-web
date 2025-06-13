import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

type StartChatData = {
  team_id: string;
  receiver_id: string;
}

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const getSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
  if (!socket) {
    socket = io(process.env.REACT_APP_CHAT_API!, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const reconnectSocket = () => {
  if (socket) {
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
  }
};


export const startChat = (
  socket:Socket<DefaultEventsMap, DefaultEventsMap>, 
  data: StartChatData
) => {
  try {

    socket.emit('start_chat', data);
  } catch (error) {

  }
}
