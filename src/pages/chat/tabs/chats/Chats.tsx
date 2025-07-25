import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Input, InputGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'src/redux/hooks';

import { useLazyGetTeamMembersQuery } from 'src/redux/services/member';
import { useGetCurrentUserQuery } from 'src/redux/services/auth';
import { useGetChatRoomsQuery } from 'src/redux/services/chat';
import { chatAPIs } from 'src/redux/services/chat';

import { useSocket } from 'src/context/hooks';
import { useDebounce } from 'src/hooks';

import { ChatContext } from 'src/context/ChatContext';
import { ChatRoom, ChatContext as TChatContext } from 'src/types';

import TeamMembers from 'src/pages/chat/tabs/chats/TeamMembers';
import { closeUserSidebar } from 'src/redux/slices/layout';

const Chats = () => {
  const [search, setSearch] = useState('');
  const [typingStatus, setTypingStatus] = useState<{ [roomId: string]: boolean }>({});

  const { activeChatRoom, setActiveChatRoom } = useContext(ChatContext) as TChatContext;

	const socket = useSocket();
  const { tid } = useParams();
	const dispatch = useAppDispatch();
  const debouncedSearch = useDebounce(search);

  const { data: currentUser } = useGetCurrentUserQuery();

  const [
    triggerGetMembers, 
    { 
      data: teamMembers, 
      isError: isTeamMembersError 
    }
  ] = useLazyGetTeamMembersQuery();

  const { 
    data: chatRooms, 
    isError: isChatRoomsError 
  } = useGetChatRoomsQuery({
    tid: tid as string,
    userId: currentUser?.id!,
    search: debouncedSearch,
  }, { skip: !currentUser?.id });

  const searchMembers = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const query = ev.target?.value;
    setSearch(query);
  };

  const openUserChat = (e:any, room:ChatRoom) => {
    e.preventDefault();
    setActiveChatRoom(room);
    localStorage.setItem('lastActiveRoom', JSON.stringify(room));
    dispatch(closeUserSidebar());
  };

  useEffect(() => {
    if (isTeamMembersError) {
      toast.error('Error fetching team members');
    }
    
    if (isChatRoomsError) {
      toast.error('Error fetching chat rooms');
    }
  }, [isTeamMembersError, isChatRoomsError]);

  useEffect(() => {
		if (!chatRooms) return;
	
		const lastActiveRoomStr = localStorage.getItem('lastActiveRoom');
		const lastActiveRoom = (lastActiveRoomStr && lastActiveRoomStr != 'undefined') ? JSON.parse(lastActiveRoomStr) : null;
	
		const matchedRoom = chatRooms.find(
			(room) => room.room_id === lastActiveRoom?.room_id
		);
	
		const roomToActivate = matchedRoom ?? chatRooms[0];
	
		setActiveChatRoom(roomToActivate);
		localStorage.setItem('lastActiveRoom', JSON.stringify(roomToActivate));
	}, [chatRooms, setActiveChatRoom]);

  useEffect(() => {
    triggerGetMembers({ tid: tid as string, search: debouncedSearch }, true)
  }, [debouncedSearch, tid]);

  useEffect(() => {
    if (!socket || !currentUser?.id) return;

    const chatRoomQueryArg = {
      tid: tid as string,
      userId: currentUser.id,
      search: debouncedSearch
    };

    const handleNewChatRoom = (resp: { data: ChatRoom }) => {
      const room = resp.data;
      setActiveChatRoom(room);
      localStorage.setItem('lastActiveRoom', JSON.stringify(room));
      dispatch(
        chatAPIs.util.updateQueryData(
          'getChatRooms',
          chatRoomQueryArg,
          (draft = []) => {
            const roomExists = draft.some(existingRoom => existingRoom.room_id === room.room_id);
            if (!roomExists) {
              draft.unshift(room);
            }
          }
        )
      );
    };

    const handleTypingEvent = (room_id: string) => {
      setTypingStatus(prev => ({...prev, [room_id]: true}))

      setTimeout(() => {
        setTypingStatus(prev => {
          const copy = { ...prev };
          delete copy[room_id]
          return copy
        })
      }, 3000);
    }

    socket.on('chat_room', handleNewChatRoom);
    socket.on('typing', handleTypingEvent);

    return () => {
      socket.off('chat_room', handleNewChatRoom);
      socket.off('typing', handleTypingEvent);
    };
  }, [socket, currentUser?.id, debouncedSearch, tid]);

  return (
    <div>
      <div className="px-4 pt-4">
        <h4 className="mb-4">Chats</h4>
        <div className="search-box chat-search-box">
          <InputGroup className="mb-3 rounded-3">
            <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
              <i className="ri-search-line search-icon font-size-18"></i>
            </span>
            <Input
              type="text"
              value={search}
              onChange={searchMembers}
              className="form-control bg-light"
              placeholder="Search members"
            />
          </InputGroup>
        </div>
      </div>

      <TeamMembers 
        teamMembers={teamMembers} 
        setSearch={setSearch} 
      />

      <div>
        <h5 className="mb-3 px-3 font-size-16">Recent</h5>
        <SimpleBar className="chat-message-list">
          <ul className="list-unstyled chat-list chat-user-list px-2" id="chat-list">
          {chatRooms?.map(room => (
              <li
                key={room.room_id}
                className={`${
                room.unread_messages_count ? "unread" : typingStatus[room.room_id] ? "typing" : room.room_id === activeChatRoom?.room_id ? "active" : ""
                }`}
              >
                <Link to="#" onClick={(e) => openUserChat(e, room)}>
                  <div onClick={(e) => openUserChat(e, room)} className="d-flex">
                    {!room.participant_profile_pic ? (
                      <div className={`chat-user-img ${room.is_participant_online && 'online'} align-self-center ms-0`}>
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                            {room.participant_name.charAt(0)}
                          </span>
                        </div>
                        {room.is_participant_online && <span className="user-status" />}
                      </div>
                    ) : (
                      <div className={`chat-user-img ${room.is_participant_online && 'online'} align-self-center ms-0`}>
                        <img
                          src={room.participant_profile_pic}
                          className="rounded-circle avatar-xs"
                          alt="chat-avatar"
                        />
                        {room.is_participant_online && <span className="user-status" />}
                      </div>
                    )}

                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="text-truncate font-size-15 mb-1 ms-3">{room.participant_name}</h5>
                      <p className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                        {typingStatus[room.room_id] ? (
                          <>
                            typing
                            <span className="animate-typing">
                              <span className="dot ms-1"></span>
                              <span className="dot ms-1"></span>
                              <span className="dot ms-1"></span>
                            </span>
                          </>
                        ) : (
                          <>
                            {(room.last_message_type === 'image' && (
                              <i className="ri-image-fill align-middle me-1"></i>
                            ))}
                            {(room.last_message_type === 'file' && (
                              <i className="ri-file-text-fill align-middle me-1"></i>
                            ))}
                            {room.last_message}
                          </>
                        )}
                      </p>
                    </div>
                    {/* <div className="font-size-11">
                      {chat.messages?.length > 0 &&
                        chat.messages[chat.messages.length - 1].time}
                    </div> */}
                    {room.unread_messages_count > 0 && (
                      <div className="unread-message">
                        <span className="badge badge-soft-danger rounded-pill">
                          {room.unread_messages_count >= 20 ? `${room.unread_messages_count}+` : room.unread_messages_count}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </SimpleBar>
      </div>
    </div>
  );
};

export default Chats;
