import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	Label,
	Input,
} from 'reactstrap';

import { usePatchCurrentTeamMemberMutation } from 'src/redux/services/member';

import type { ChatContext as TChatContext } from 'src/types/chat';
import { ChatContext } from 'src/context/ChatContext';

import { SpinningButton } from 'src/components';

type EditProfileFormInput = {
	firstName: string;
	lastName: string;
	displayName: string;
	title: string;
	phoneNumber: string;
	status: string;
}

type Props = {
	toggleProfileForm: (val: boolean) => void;
}

const EditProfile: React.FC<Props> = ({ toggleProfileForm }) => {
	const { t } = useTranslation();
	const { tid } = useParams();

	const [isSaving, setIsSaving] = useState(false);

	const { currentMember } = useContext(ChatContext) as TChatContext;

	const [patchCurrentTeamMember] = usePatchCurrentTeamMemberMutation();

	const toggleModal = () => {
		toggleProfileForm(false);
	}

	const formik = useFormik<EditProfileFormInput>({
		initialValues: {
			firstName: currentMember!.user.first_name,
			lastName: currentMember!.user.last_name,
			displayName: currentMember!.display_name || '',
			title: currentMember!.title || '',
			phoneNumber: currentMember!.phone_number || '',
			status: currentMember!.status || '',
		},
		validationSchema: yup.object({
			firstName: yup.string().required(t('Enter your first name')),
			lastName: yup.string().required(t('Enter your last name')),
			displayName: yup.string(),
			title: yup.string(),
			phoneNumber: yup.string(),
			status: yup.string(),
		}),
		onSubmit: (data) => {
			setIsSaving(true);
			patchCurrentTeamMember({
				teamTid: tid, 
				id: currentMember!.id, 
				data: {
					firstName: data.firstName,
					lastName: data.lastName,
					displayName: data.displayName,
					title: data.title,
					phoneNumber: data.phoneNumber,
					status: data.status,
				}
			})
			.unwrap()
			.then(() => {
				toast.success('Profile updated successfully!');
			})
			.catch((error) => {
				console.dir(error)
				toast.error('Profile update failed!');
			}).finally(() => {
				setIsSaving(false);
			});
		},
	});

	return (
		<div>
			<Modal isOpen={true} centered toggle={toggleModal}>
				<ModalHeader
					tag="h5"
					className="font-size-16"
					toggle={toggleModal}
				>
					{t('Edit Profile')}
				</ModalHeader>
				<ModalBody className="p-4">
					<Form id="member-profile-form" onSubmit={formik.handleSubmit}>
						<div className="mb-4 d-flex w-100">
							<div className='col-md-6 me-1'>
								<Label
									className="form-label"
									htmlFor="firstname-input"
								>
									{t('First Name')}
								</Label>
								<Input
									name="firstName"
									type="text"
									value={formik.values.firstName}
									className="form-control"
									id="firstname-input"
									placeholder={t('Enter first name')}
									onChange={formik.handleChange} 
								/>
							</div>

							<div className='col-md-6 ms-1 pe-2'>
								<Label
									className="form-label"
									htmlFor="lastname-input"
								>
									{t('Last Name')}
								</Label>
								<Input
									name="lastName"
									type="text"
									value={formik.values.lastName}
									className="form-control"
									id="lastname-input"
									placeholder={t('Enter last name')}
									onChange={formik.handleChange} 
								/>
							</div>
						</div>

						<div className="mb-4">
							<Label
								className="form-label"
								htmlFor="dislayname-input"
							>
								{t('Display Name')}
							</Label>
							<Input
								name="displayName"
								type="text"
								value={formik.values.displayName}
								className="form-control"
								id="dislayname-input"
								placeholder={t('Enter Display Name')}
								onChange={formik.handleChange} 
							/>
						</div>

						<div className="mb-4">
							<Label
								className="form-label"
								htmlFor="title-input"
							>
								{t('Title')}
							</Label>
							<Input
								name="title"
								type="text"
								value={formik.values.title}
								className="form-control"
								id="title-input"
								placeholder={t('Enter your title')}
								onChange={formik.handleChange} 
							/>
						</div>

						<div className="mb-4">
							<Label
								className="form-label"
								htmlFor="phonenumber-input"
							>
								{t('Phone')}
							</Label>
							<Input
								name="phoneNumber"
								type="text"
								value={formik.values.phoneNumber}
								className="form-control"
								id="phonenumber-input"
								placeholder={t('Enter your phone number')}
								onChange={formik.handleChange} 
							/>
						</div>

						<div className="mb-4">
							<Label
								className="form-label"
								htmlFor="status-input"
							>
								{t('Status')}
							</Label>
							<Input
								name="status"
								type="select"
								value={formik.values.status}
								className="form-control"
								id="status-input"
								placeholder={t('Select your status')}
								onChange={formik.handleChange} 
							>
								<option value="" hidden>
									-- Select your status --
								</option>
								<option value="meeting">In a Meeting</option>
								<option value="commuting">Commuting</option>
								<option value="remote">Working Remotely</option>
								<option value="sick">Sick</option>
								<option value="leave">On Leave</option>
							</Input>
						</div>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button type="button" color="link" onClick={toggleModal}>
						{t('Close')}
					</Button>
					<SpinningButton 
						form="member-profile-form"
						buttonText={t("Save")}
						isLoading={isSaving}
						disabled={!formik.isValid} 
						type="submit" color="primary"
					/>
				</ModalFooter>
			</Modal>
		</div>
	)
}

export default EditProfile;
