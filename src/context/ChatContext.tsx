import React, { createContext, useState, useMemo } from 'react';

import type { ChatContext as TChatContext } from 'src/types/chat';
import type { ChatRoom } from 'src/types/chat';

export const ChatContext = createContext<TChatContext | null>(null);

type ChatContextProps = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: ChatContextProps) => {
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);

  const contextValue = useMemo(
    () => ({
			activeChatRoom,
			setActiveChatRoom,
    }),
    [activeChatRoom],
  );
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
