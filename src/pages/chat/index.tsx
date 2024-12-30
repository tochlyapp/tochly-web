import React from "react";
// Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/index";
import { useAppSelector } from 'src/redux/hooks';

const Index = () => {
    // Redux state
    const users = useAppSelector((state) => state.chat.users);

    // Set document title
    React.useEffect(() => {
        document.title = "Chat | Chatvia - Responsive Bootstrap 5 Admin Dashboard";
    }, []);

    return (
        <React.Fragment>
            {/* Chat left sidebar */}
            <ChatLeftSidebar />

            {/* User chat */}
            <UserChat recentChatList={users} />
        </React.Fragment>
    );
};

export default Index;
