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
} from 'src/redux/services/teamAPIs';
import { useCreateTeamMemberMutation } from 'src/redux/services/memberAPI';
import { useGetCurrentUserQuery } from 'src/redux/services/authAPI';

import { SpinningButton, FormIputGroup } from 'src/components';
import { TEAM_PERMISION_OWNER } from 'src/pages/team/constants';

type FormInput = {
  name: string;
  description: string;
};

export default function CreateTeam() {
  const [show, setShow] = useState(false);
  const [skip, setSkip] = useState(true);
  const [teamName, setTeamName] = useState('');

  const { t } = useTranslation();

  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const [createTeamMember, { isLoading: isCreatingTeamMember }] = useCreateTeamMemberMutation();
  const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteTeamMutation();

  const { data: teams } = useGetTeamByNameQuery(teamName, { skip });
  const { data: currentUser } = useGetCurrentUserQuery();

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

  const toggleModal = useCallback(() => setShow(!show), [show]);

  const createMember = useCallback(() => {
    if (teams && teams.length > 0 && currentUser) {
      const createdTeam = teams[0];
      createTeamMember({
        user: currentUser.email,
        teamId: createdTeam.id,
        permissions: TEAM_PERMISION_OWNER,
        isActive: true,
      })
        .unwrap()
        .then(() => {
          toast.success('Team created successfully');
          toggleModal(); // Close modal
        })
        .catch((error) => {
          deleteTeam(createdTeam.id); // Rollback team creation
          toast.error(`Team creation failed! ${error.data?.name?.[0] || ''}`);
        });
    }
  }, [createTeamMember, currentUser, deleteTeam, teams, toggleModal]);

  useEffect(() => {
    if (!skip && teams) {
      createMember();
      setSkip(true);
    }
  }, [teams, createMember, skip]);

  return (
    <>
      <Button onClick={toggleModal} type="button">
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
              <FormIputGroup
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
              <FormIputGroup
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
                textArea
              />
              <div className="d-flex w-100">
                <Button color="secondary" onClick={toggleModal}>
                  {t('Close')}
                </Button>
                <SpinningButton
                  name={t('Create')}
                  isLoading={isCreatingTeam || isCreatingTeamMember || isDeletingTeam}
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
