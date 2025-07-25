import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	UncontrolledTooltip,
	Form,
	Label,
	Input,
} from 'reactstrap';

import { useSendInvitationMutation } from 'src/redux/services/invitation';

import type { ChatContext as TChatContext } from 'src/types/chat';
import { ChatContext } from 'src/context/ChatContext';
import { isOlderThan24Hours } from 'src/utils/date';
import { SpinningButton } from 'src/components';

type InviteFormInput = {
	email: string;
	role: string
}

const InviteMember: React.FC = () => {
	const { t } = useTranslation();
	const { tid } = useParams();
	const [modal, setModal] = useState(false);
	const { currentMember } = useContext(ChatContext) as TChatContext;
	const [sendInvitation, { isLoading: isSendingInvitation }] = useSendInvitationMutation();

	const storeInvitationRecord = (email: string) => {
		const invitationsString = localStorage.getItem('invitations');
		let invitations: Record<string, Record<string, string>> = {};
		if (invitationsString) invitations = JSON.parse(invitationsString);
		if (!invitations[tid!]) invitations[tid!] = {};
		invitations[tid!][email] = new Date().toISOString();
		localStorage.setItem('invitations', JSON.stringify(invitations));
	}
	
	const allowInvitation = (email: string) => {
		const invitationsString = localStorage.getItem('invitations')
		if (!invitationsString) return true;
		const invitation = JSON.parse(invitationsString);
		const teamInvitations = invitation[tid!];
		if (!teamInvitations) return true;
		const lastInvitationDatetime = teamInvitations[email]
		if (!lastInvitationDatetime) return true;
		return isOlderThan24Hours(lastInvitationDatetime)
	}

	const toggleModal = () => {
		setModal((prevModal) => !prevModal);
	};
	
	const formik = useFormik<InviteFormInput>({
		initialValues: {
			email: '',
			role: '',
		},
		validationSchema: yup.object({
			email: yup.string().required(t('Please Enter Your Email')),
			role: yup.string().required(t('Enter membership role')),
		}),
		onSubmit: (data) => {
			if (!allowInvitation(data.email)) {
				toast.info('This user already has an open invitation.');
				return
			}
			const url = `${process.env.REACT_APP_REDIRECT_URL}/invitations/accept-invite` 
			sendInvitation({
				tid: tid as string, 
				inviteeEmail: data.email, 
				invitedBy: currentMember!.user.id,
				role: data.role, 
				url 
			})
			.unwrap()
			.then((resp) => {
				toast.success(resp.detail);
				storeInvitationRecord(data.email);
				toggleModal();
				formik.resetForm()
			})
			.catch((error) => {
				console.dir(error)
				toast.error('Failed to send invitation to user!');
			});
		},
	});

  return (
		<>
			{currentMember?.role === 'admin' && (
				<div className="user-chat-nav float-end">
					<div id="add-member">
						<Button
							type="button"
							color="link"
							onClick={toggleModal}
							className="text-decoration-none text-muted font-size-18 py-0"
						>
							<i className="ri-user-add-line"></i>
						</Button>
					</div>
					<UncontrolledTooltip target="add-member" placement="bottom">
						{t('Add Member')}
					</UncontrolledTooltip>
				</div>
			)}

			<Modal isOpen={modal} centered toggle={toggleModal}>
				<ModalHeader
					tag="h5"
					className="font-size-16"
					toggle={toggleModal}
				>
					{t('Add Member')}
				</ModalHeader>
				<ModalBody className="p-4">
					<Form id="user-invite-form" onSubmit={formik.handleSubmit}>
						<div className="mb-4">
							<Label
								className="form-label"
								htmlFor="addcontactemail-input"
							>
								{t('Email')}
							</Label>
							<Input
								name="email"
								type="email"
								value={formik.values.email}
								className="form-control"
								id="addcontactemail-input"
								placeholder={t('Enter Email')}
								onChange={formik.handleChange} 
							/>
						</div>

						<div className="mb-4">
							<Label
								className="form-label"
								htmlFor="role-input"
							>
								{t('Role')}
							</Label>
							<Input
								name="role"
								type="select"
								value={formik.values.role}
								className="form-control"
								id="role-input"
								placeholder={t('Select User Role')}
								onChange={formik.handleChange} 
							>
								<option value="" hidden>
									-- Select user role --
								</option>
								<option value="member">Member</option>
								<option value="admin">Admin</option>
							</Input>
						</div>

						{/* <div>
							<Label
								className="form-label"
								htmlFor="addcontact-invitemessage-input"
							>
								{t('Invitation Message')}
							</Label>
							<textarea
								className="form-control"
								id="addcontact-invitemessage-input"
								rows={3}
								placeholder={t('Enter Message')}
							/>
						</div> */}
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button type="button" color="link" onClick={toggleModal}>
						{t('Close')}
					</Button>
					<SpinningButton 
						form="user-invite-form"
						buttonText={t("Invite User")}
						isLoading={isSendingInvitation}
						disabled={!formik.isValid} 
						type="submit" color="primary"
					/>
				</ModalFooter>
			</Modal>
		</>
	)
}

export default InviteMember;
