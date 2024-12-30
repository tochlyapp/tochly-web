import React, { useState, useEffect, useMemo } from 'react';
import { Input, InputGroup } from "reactstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";

import { useAppSelector, useAppDispatch } from 'src/redux/hooks';

import { activeUser } from "src/redux/slices/chat";
import { setconversationNameInOpenChat } from 'src/redux/slices/layout';

//components
import OnlineUsers from "./OnlineUsers";

const Chats = () => {
    const [searchChat, setSearchChat] = useState("");
    const { active_user: activeUserId, users: recentChatList } = useAppSelector((state) => state.chat);

    const dispatch = useAppDispatch();

    const filteredChatList = useMemo(() => {
        if (!searchChat) return recentChatList;
        return recentChatList.filter((chat) =>
            chat.name.toLowerCase().includes(searchChat.toLowerCase())
        );
    }, [searchChat, recentChatList]);

    const handleSearchChange = (e:any) => {
        setSearchChat(e.target.value);
    };

    const openUserChat = (e:any, chat:any) => {
        e.preventDefault();
        const index = recentChatList.indexOf(chat);
        dispatch(activeUser(index));
    };

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
                            value={searchChat}
                            onChange={handleSearchChange}
                            className="form-control bg-light"
                            placeholder="Search messages or users"
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Online users */}
            <OnlineUsers />

            {/* Chat message list */}
            <div>
                <h5 className="mb-3 px-3 font-size-16">Recent</h5>
                <SimpleBar className="chat-message-list">
                    <ul className="list-unstyled chat-list chat-user-list px-2" id="chat-list">
                        {filteredChatList.map((chat:any, key:number) => (
                            <li
                                key={key}
                                className={`${
                                    chat.unRead ? "unread" : chat.isTyping ? "typing" : key === activeUserId ? "active" : ""
                                }`}
                            >
                                <Link to="#" onClick={(e) => openUserChat(e, chat)}>
                                    <div className="d-flex">
                                        {chat.profilePicture === "Null" ? (
                                            <div className={`chat-user-img ${chat.status} align-self-center ms-0`}>
                                                <div className="avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                        {chat.name.charAt(0)}
                                                    </span>
                                                </div>
                                                {chat.status && <span className="user-status"></span>}
                                            </div>
                                        ) : (
                                            <div className={`chat-user-img ${chat.status} align-self-center ms-0`}>
                                                <img
                                                    src={chat.profilePicture}
                                                    className="rounded-circle avatar-xs"
                                                    alt="chat-avatar"
                                                />
                                                {chat.status && <span className="user-status"></span>}
                                            </div>
                                        )}

                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="text-truncate font-size-15 mb-1 ms-3">{chat.name}</h5>
                                            <p className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                                                {chat.isTyping ? (
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
                                                        {chat.messages?.length > 0 &&
                                                            (chat.messages[chat.messages.length - 1].isImageMessage && (
                                                                <i className="ri-image-fill align-middle me-1"></i>
                                                            ))}
                                                        {chat.messages?.length > 0 &&
                                                            (chat.messages[chat.messages.length - 1].isFileMessage && (
                                                                <i className="ri-file-text-fill align-middle me-1"></i>
                                                            ))}
                                                        {chat.messages?.length > 0 &&
                                                            chat.messages[chat.messages.length - 1].message}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                        <div className="font-size-11">
                                            {chat.messages?.length > 0 &&
                                                chat.messages[chat.messages.length - 1].time}
                                        </div>
                                        {chat.unRead > 0 && (
                                            <div className="unread-message">
                                                <span className="badge badge-soft-danger rounded-pill">
                                                    {chat.unRead >= 20 ? `${chat.unRead}+` : chat.unRead}
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
