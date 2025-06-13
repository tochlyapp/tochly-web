import React, { createContext, useState, useMemo } from 'react';

import type { ChatContext as TChatContext, ChatRoom } from 'src/types/chat';
import type { TeamMember } from 'src/types/member';

export const ChatContext = createContext<TChatContext | null>(null);

type ChatContextProps = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: ChatContextProps) => {
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
	const [currentMember, setCurrentMember] = useState<TeamMember | null>(null)

  const contextValue = useMemo(
    () => ({
			activeChatRoom,
			setActiveChatRoom,
			currentMember,
			setCurrentMember,
    }),
    [activeChatRoom, currentMember],
  );
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
