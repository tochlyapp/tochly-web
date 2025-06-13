import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAppSelector } from 'src/redux/hooks';

import ChatLeftSidebar from './ChatLeftSidebar';
import UserChat from './user-chat/index';

import { useGetCurrentUserQuery } from 'src/redux/services/auth';
import { useGetTeamMembersQuery } from 'src/redux/services/member';

import { ChatContext } from 'src/context/ChatContext';
import { ChatContext as TChatContext } from 'src/types';

const Index = () => {
	const { tid } = useParams();

	const { data: currentUser } = useGetCurrentUserQuery();
	const { 
			data: teamMembers, 
			isError: isTeamMembersError, 
		} = useGetTeamMembersQuery(
		{
			tid: tid as string,
			userId: String(currentUser?.id),
		},
		{skip: !currentUser}
	);

	const { setCurrentMember } = useContext(ChatContext) as TChatContext;
	const users = useAppSelector((state) => state.chat.users);

	useEffect(() => {
		if (isTeamMembersError) {
			toast.error('Error fetching team members!');
		}
		if (teamMembers?.length) setCurrentMember(teamMembers[0])
	}, [teamMembers])

	// Set document title
	React.useEffect(() => {
		document.title = 'Chat | Tochly - Team Chatting application';
	}, []);

	return (
		<React.Fragment>
			<ChatLeftSidebar />
			<UserChat recentChatList={users} />
		</React.Fragment>
	);
};

export default Index;
