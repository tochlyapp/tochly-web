import { TeamMember } from "./member";

type TMessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

export type ChatRoom = {
	room_id: string;
	participant_id: string;
	participant_name: string;
	is_participant_online: boolean;
	participant_profile_pic: string;
	last_message: string;
	last_message_type: TMessageType;
	unread_messages_count: number;
	created_at: string;
}

export type ChatContext = {
  activeChatRoom: ChatRoom | null;
  setActiveChatRoom: (room: ChatRoom) => void;
	currentMember: TeamMember | null;
	setCurrentMember: (member: TeamMember) => void;
	isLoggedInUser: boolean;
	setIsLoggedInUser: (isLoggedInUser: boolean) => void;
}
