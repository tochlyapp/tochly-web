import React, { useState, useContext } from 'react';
import { 
	Dropdown, 
	DropdownMenu,
	DropdownItem, 
	DropdownToggle, 
	Input, 
	Row, 
	Col, 
	Modal, 
	ModalBody 
} from 'reactstrap';
import { Link } from 'react-router-dom';

import { useAppDispatch } from 'src/redux/hooks';

import { openUserSidebar } from 'src/redux/slices/layout';

import { ChatContext } from 'src/context/ChatContext';
import { ChatContext as TChatContext } from 'src/types';

const UserHead: React.FC = () => {
	const [dropdownState, setDropdownState] = useState({
		main: false,
		more: false,
		callModal: false,
		videoModal: false,
	});

	const { activeChatRoom } = useContext(ChatContext) as TChatContext;
	const dispatch = useAppDispatch();

	const toggleDropdown = (key: any) =>
		setDropdownState((prev) => ({ ...prev, [key]: !(prev as any)[key] }));

	const handleOpenUserSidebar = (e: any) => {
		e.preventDefault();
		dispatch(openUserSidebar());
	};

	const handleDeleteMessages = () => {
		// I will get back to this
	};

	const renderUserStatus = (online='false') => {
		const statusClass = {
			true: 'text-success',
			false: 'text-secondary',
		};

		return online && (
			<i
				className={`ri-record-circle-fill font-size-10 ${(statusClass as any)[online]} d-inline-block ms-2`}
			></i>
		);
	};

	return (
		<div className="p-3 p-lg-4 border-bottom user-chat-topbar">
			<Row className="align-items-center">
				<Col sm={4} xs={8}>
					<div className="d-flex align-items-center">
						{activeChatRoom?.participant_profile_pic ? (
							<div className="me-3">
								<img
									src={activeChatRoom?.participant_profile_pic || ''}
									className="rounded-circle avatar-xs"
									alt="tochly"
								/>
							</div>
						) : (
							<div className="chat-user-img align-self-center me-3">
								<div className="avatar-xs">
									<span className="avatar-title rounded-circle bg-primary-subtle text-primary">
										{activeChatRoom?.participant_name?.charAt(0)}
									</span>
								</div>
							</div>
						)}
						<div className="flex-grow-1 overflow-hidden">
							<h5 className="font-size-16 mb-0 text-truncate">
								<Link
									to="#"
									onClick={handleOpenUserSidebar}
									className="text-reset user-profile-show"
								>
									{activeChatRoom?.participant_name}
								</Link>
								{renderUserStatus(String(activeChatRoom?.is_participant_online))}
							</h5>
						</div>
					</div>
				</Col>
				<Col sm={8} xs={4}>
					<ul className="list-inline user-chat-nav text-end mb-0">
						<li className="list-inline-item">
							<Dropdown
								isOpen={dropdownState.main}
								toggle={() => toggleDropdown("main")}
							>
								<DropdownToggle color="none" className="btn nav-btn">
									<i className="ri-search-line"></i>
								</DropdownToggle>
								<DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-md">
									<div className="search-box p-2">
										<Input
											type="text"
											className="form-control bg-light border-0"
											placeholder="Search.."
										/>
									</div>
								</DropdownMenu>
							</Dropdown>
						</li>
						<li className="list-inline-item d-none d-lg-inline-block me-2">
							<button
								type="button"
								onClick={() => toggleDropdown("callModal")}
								className="btn nav-btn"
							>
								<i className="ri-phone-line"></i>
							</button>
						</li>
						<li className="list-inline-item d-none d-lg-inline-block me-2">
							<button
								type="button"
								onClick={() => toggleDropdown("videoModal")}
								className="btn nav-btn"
							>
								<i className="ri-vidicon-line"></i>
							</button>
						</li>
						<li className="list-inline-item">
							<Dropdown
								isOpen={dropdownState.more}
								toggle={() => toggleDropdown("more")}
							>
								<DropdownToggle color="none" className="btn nav-btn">
									<i className="ri-more-fill"></i>
								</DropdownToggle>
								<DropdownMenu className="dropdown-menu-end">
									<DropdownItem
										onClick={handleOpenUserSidebar}
									>
										View Profile <i className="ri-user-2-line float-end text-muted"></i>
									</DropdownItem>
									<DropdownItem>
										Archive <i className="ri-archive-line float-end text-muted"></i>
									</DropdownItem>
									<DropdownItem>
										Muted <i className="ri-volume-mute-line float-end text-muted"></i>
									</DropdownItem>
									<DropdownItem onClick={handleDeleteMessages}>
										Delete <i className="ri-delete-bin-line float-end text-muted"></i>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</li>
					</ul>
				</Col>
			</Row>

			{/* Call Modal */}
			<Modal isOpen={dropdownState.callModal} toggle={() => toggleDropdown("callModal")} centered>
				<ModalBody>
					<div className="text-center p-4">
						<div className="avatar-lg mx-auto mb-4">
							{activeChatRoom?.participant_profile_pic && (
								<img 
									src={activeChatRoom.participant_profile_pic} 
									alt="Avatar" 
									className="img-thumbnail rounded-circle" 
								/>
							)}
						</div>
						<h5 className="text-truncate">{activeChatRoom?.participant_name || "User"}</h5>
						<p className="text-muted">Start Audio Call</p>
						<div className="mt-5">
							<button
								type="button"
								className="btn btn-danger avatar-sm rounded-circle"
								onClick={() => toggleDropdown("callModal")}
							>
								<i className="ri-close-fill"></i>
							</button>
							<button type="button" className="btn btn-success avatar-sm rounded-circle">
								<i className="ri-phone-fill"></i>
							</button>
						</div>
					</div>
				</ModalBody>
			</Modal>

			{/* Video Modal */}
			<Modal isOpen={dropdownState.videoModal} toggle={() => toggleDropdown("videoModal")} centered>
				<ModalBody>
					<div className="text-center p-4">
						<div className="avatar-lg mx-auto mb-4">
							{activeChatRoom?.participant_profile_pic && (
								<img 
									src={activeChatRoom.participant_profile_pic} 
									alt="Avatar" 
									className="img-thumbnail rounded-circle" 
								/>
							)}
						</div>
						<h5 className="text-truncate">{activeChatRoom?.participant_name || "Unkown"}</h5>
						<p className="text-muted">Start Video Call</p>
						<div className="mt-5">
							<button
								type="button"
								className="btn btn-danger avatar-sm rounded-circle"
								onClick={() => toggleDropdown("videoModal")}
							>
								<i className="ri-close-fill"></i>
							</button>
							<button type="button" className="btn btn-success avatar-sm rounded-circle">
								<i className="ri-vidicon-fill"></i>
							</button>
						</div>
					</div>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default UserHead;
