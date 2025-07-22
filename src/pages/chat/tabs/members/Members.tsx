import React, { useState, useEffect, useContext } from 'react';
import {
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button,
	Input,
	InputGroup,
} from 'reactstrap';
import { toast } from 'react-toastify';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useGetTeamMembersQuery } from 'src/redux/services/member';
import { useDebounce } from 'src/hooks';

import type { ChatContext as TChatContext } from 'src/types/chat';
import type { TeamMember } from 'src/types/member';

import { ChatContext } from 'src/context/ChatContext';
import InviteMember from './InviteMember';

const Members = () => {
	const { t } = useTranslation();
	const { tid } = useParams();

	const [search, setSearch] = useState('');
	const [sortedMembers, setSortedMembers] = useState<any>([]);

	const { currentMember } = useContext(ChatContext) as TChatContext;
	const debouncedSearch = useDebounce(search);

	const { 
		data: teamMembers, 
		isError: isTeamMembersError, 
	} = useGetTeamMembersQuery({
		tid: tid!,
		search: debouncedSearch,
	});

	const searchMembers = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const query = ev.target?.value;
		setSearch(query);
	};

	// Sort members alphabetically
	const sortMembers = (members: TeamMember[]) => {
		const sorted = members.reduce((acc: any, member: any) => {
			try {
				// Group by the first letter of the name
				const group = member.full_name[0].toUpperCase();
				if (!acc[group]) acc[group] = { group, children: [member] };
				else acc[group].children.push(member);
			} catch (error) {
				return [];
			}
			return acc;
		}, {});

		return Object.values(sorted);
	};

	useEffect(() => {
		if (teamMembers) {
			const sorted = sortMembers(teamMembers);
			setSortedMembers(sorted);
		}
		if (isTeamMembersError) {
			toast.error('Error fetching team members!');
		}
	}, [teamMembers, isTeamMembersError]);

	return (
		<React.Fragment>
			<div>
				<div className="p-4">
					<InviteMember />
					<h4 className="mb-4">{t('Members')}</h4>

					<div className="search-box chat-search-box">
						<InputGroup size="lg" className="bg-light rounded-lg">
							<Button
								color="link"
								className="text-decoration-none text-muted pr-1"
								type="button"
							>
								<i className="ri-search-line search-icon font-size-18"></i>
							</Button>
							<Input
								type="text"
								onChange={searchMembers}
								className="form-control bg-light"
								placeholder={t('Search members..')}
							/>
						</InputGroup>
					</div>
				</div>

				<SimpleBar
					style={{ maxHeight: "100%" }}
					id="chat-room"
					className="p-4 chat-message-list chat-group-list"
				>
					{sortedMembers.map((sorted: any, index: number) => (
						<div key={index} className={index === 0 ? "" : "mt-3"}>
							<div className="p-3 fw-bold text-primary">
								{sorted.group}
							</div>
							<ul className="list-unstyled contact-list">
								{sorted.children.map((member: TeamMember) => (
									<li key={member.id}>
										<div className="d-flex align-items-center">
											<div className="flex-grow-1">
												<h5 className="font-size-14 m-0">{member.display_name}</h5>
											</div>
											{currentMember?.role === 'admin' && (
												<UncontrolledDropdown>
													<DropdownToggle tag="a" className="text-muted">
														<i className="ri-more-2-fill"></i>
													</DropdownToggle>
													<DropdownMenu className="dropdown-menu-end">
														<DropdownItem>
															{t('Edit')}{' '}
															<i className="ri-edit-line float-end text-muted"></i>
														</DropdownItem>
														{member.user.id !== currentMember?.user.id && (
															<DropdownItem>
																{t('Remove')}{' '}
																<i className="ri-delete-bin-line float-end text-muted"></i>
															</DropdownItem>
														)}
													</DropdownMenu>
												</UncontrolledDropdown>
											)}
										</div>
									</li>
								))}
							</ul>
						</div>
					))}
				</SimpleBar>
			</div>
		</React.Fragment>
	);
};

export default Members;
