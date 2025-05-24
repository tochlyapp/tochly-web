import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Form, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { 
  useGetTeamByNameQuery,
  useCreateTeamMutation, 
  useDeleteTeamMutation,
} from 'src/redux/services/team';
import { useCreateTeamMemberMutation } from 'src/redux/services/member';
import { useGetCurrentUserQuery } from 'src/redux/services/auth';

import { SpinningButton, FormInputGroup } from 'src/components';
import { TEAM_ROLE_OWNER } from 'src/pages/team/constants';


import { startChat } from 'src/lib/socket';
import { useSocket } from 'src/context/hooks';

type FormInput = {
  name: string;
  description: string;
};

export default function CreateTeam() {
  const [show, setShow] = useState(false);
  const [skip, setSkip] = useState(true);
  const [teamName, setTeamName] = useState('');

  const { t } = useTranslation();
  const socket = useSocket();

  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const [createTeamMember, { isLoading: isCreatingTeamMember }] = useCreateTeamMemberMutation();
  const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteTeamMutation();

  const { data: teams } = useGetTeamByNameQuery(teamName, { skip });
  const { data: currentUser } = useGetCurrentUserQuery();

  

  const isLoading = isCreatingTeam || isCreatingTeamMember || isDeletingTeam;

  const formik = useFormik<FormInput>({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: yup.object({
      name: yup.string().required(t('Enter team name')),
      description: yup.string().required(t('Enter team description')),
    }),
    onSubmit: (data) => {
      createTeam({ name: data.name, description: data.description || '' })
        .unwrap()
        .then(() => {
          setTeamName(data.name);
          setSkip(false);
        })
        .catch((error) => {
          toast.error(`Team creation failed! ${error.data?.name?.[0] || ''}`);
        });
    },
  });

  const toggleModal = useCallback(() => {
    setShow(!show);
    if (!show) {
      formik.resetForm();
      setTeamName('');
      setSkip(true);
    }
  }, [show, formik]);
  

  const createMember = useCallback(() => {
    if (teams && teams.length > 0 && currentUser) {
      const createdTeam = teams[0];
      createTeamMember({
        user: currentUser.id,
        teamTid: createdTeam.tid,
        role: TEAM_ROLE_OWNER,
        isActive: true,
      })
        .unwrap()
        .then(() => {
          toast.success(t('Team created successfully'));
          // Create a personal chat space for user
          startChat(
            socket!, 
            {team_id: createdTeam.tid, receiver_id: String(currentUser.id)}
          );
          toggleModal(); // Close modal
        })
        .catch((error) => {
          deleteTeam(createdTeam.tid); // Rollback team creation
          toast.error(`Team creation failed! ${error.data?.name?.[0] || ''}`);
        });
    }
  }, [createTeamMember, currentUser, deleteTeam, teams, toggleModal, t]);

  useEffect(() => {
    if (!skip && teams) {
      createMember();
      setSkip(true);
    }
  }, [teams, createMember, skip]);

  return (
    <>
      <Button 
        color="light" 
        className="create-team-btn" 
        onClick={toggleModal} 
      >
        {t('CREATE A NEW TEAM')}
      </Button>
      <div>
        <Modal
          isOpen={show}
          toggle={toggleModal}
          backdrop="static"
          keyboard={false}
          centered
        >
          <ModalHeader>{t('Create New Team')}</ModalHeader>
          <ModalBody>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <FormInputGroup
                label={t("Name")}
                fieldName="name"
                type="text"
                value={formik.values.name}
                inputError={formik.errors.name}
                placeholder={t("Team Name")}
                classNameInput="border-secondary"
                classNameGroup="mb-3 bg-soft-light rounded-3"
                invalid={!!(formik.touched.name && formik.errors.name)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormInputGroup
                label={t("Description")}
                fieldName="description"
                type="textarea"
                value={formik.values.description}
                inputError={formik.errors.description}
                placeholder={t("Team Description")}
                classNameInput="border-secondary"
                classNameGroup="mb-3 bg-soft-light rounded-3"
                invalid={!!(formik.touched.description && formik.errors.description)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="d-flex w-100">
                <Button color="secondary" onClick={toggleModal}>
                  {t('Close')}
                </Button>
                <SpinningButton
                  buttonText={t('Create')}
                  isLoading={isLoading}
                  color="primary"
                  className="ms-auto waves-effect waves-light"
                  type="submit"
                />
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
}
