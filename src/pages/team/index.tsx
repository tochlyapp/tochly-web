import Chat from 'src/pages/chat';

import { ChatProvider } from 'src/context';

export default function Page() {
  return (
      <ChatProvider>
        <Chat />
      </ChatProvider>
  );
}
