import { chatBaseAPI } from 'src/redux/services/base/baseAPI';
import { ChatRoom } from 'src/types/chat';

type ChatRoomParams = {
  tid: string;
  userId: number;
  search?: string;
}

type ChatMessageParams = {
  room_id: string;
  userId: number;
  search?: string;
}

export const chatAPIs = chatBaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getChatRooms: builder.query<ChatRoom[],  ChatRoomParams>({
      query: ({ tid, userId, search='' }) => `/chats/rooms?team_id=${tid}&user_id=${userId}&search=${search}`,
      providesTags: ['ChatRoom']
    }),
    getRoomChatMessages: builder.query<ChatRoom[],  ChatMessageParams>({
      query: ({ room_id, userId, search }) => `/chats/rooms/${room_id}/messages?user_id=${userId}&search=${search}`,
      providesTags: ['ChatMessage']
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
} = chatAPIs;
