import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';


type StartChatData = {
  team_id: string;
  receiver_id: string;
}

export function startChat(
  socket:Socket<DefaultEventsMap, DefaultEventsMap>, 
  data: StartChatData
) {
  socket.emit('start_chat', data);
}
