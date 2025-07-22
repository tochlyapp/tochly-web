import React from 'react';
import { TabContent, TabPane } from "reactstrap";

import { useAppSelector } from 'src/redux/hooks';

// Import Components
import Profile from 'src/pages/chat/tabs/Profile';
import Chats from 'src/pages/chat/tabs/chats';
import Groups from 'src/pages/chat/tabs/Groups';
import Members from 'src/pages/chat/tabs/members';
import Settings from 'src/pages/chat/tabs/Settings';


const ChatLeftSidebar: React.FC = () => {
	const activeTab = useAppSelector((state) => state.layout.activeTab);

	// Configuration for tabs
	const tabs = [
		{ id: 'pills-user', tabId: 'profile', component: <Profile /> },
		{ id: 'pills-chat', tabId: 'chat', component: <Chats /> },
		{ id: 'pills-groups', tabId: 'group', component: <Groups /> },
		{ id: 'pills-members', tabId: 'members', component: <Members /> },
		{ id: 'pills-setting', tabId: 'settings', component: <Settings /> },
	];

	return (
		<div className="chat-leftsidebar me-lg-1">
			<TabContent activeTab={activeTab}>
				{tabs.map((tab) => (
					<TabPane tabId={tab.tabId} id={tab.id} key={tab.tabId}>
						{tab.component}
					</TabPane>
				))}
			</TabContent>
		</div>
	);
};

export default ChatLeftSidebar;
