'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';

import { useAppSelector } from '@/redux/hooks';
import { 
  useGetUserTeamsQuery, 
  useGetTeamByNameQuery,
  useCreateTeamMutation, 
  useDeleteTeamMutation,
} from '@/redux/services/teamAPIs';
import { useCreateTeamMemberMutation } from '@/redux/services/memberAPI';
import { useGetCurrentUserQuery } from '@/redux/services/authAPI';

import { SpinningButton, FormGroup } from '@/app/components';

import { TEAM_PERMISION_OWNER } from '@/app/constants';

import { FormInputError } from '@/app/types';


type FormInput = {
  name: string;
  description?: string;
};

export default function Page() {
  const [show, setShow] = useState(false);
  const [skip, setSkip] = useState(true);
  const [teamName, setTeamName] = useState('');

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const [createTeamMember, { isLoading: isCreatingTeamMember }] = useCreateTeamMemberMutation();
  const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteTeamMutation();

  const { data: userTeams } = useGetUserTeamsQuery();
  const { data: teams } = useGetTeamByNameQuery(teamName, {skip});
  const { data: currentUser } = useGetCurrentUserQuery();

  const schema = yup.object().shape({
    name: yup.string().required('required').min(3).max(50),
    description: yup.string().max(500),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: yupResolver(schema) });

  useEffect(() => {
    createMember();
    setSkip(true)
  }, [teams])

  const closeModal = () => setShow(false);
  const showModal = () => setShow(true);

  const createMember = () => {
    if (teams && currentUser) {
      const createdTeam = teams[0]
      createTeamMember({
        user: currentUser.email,
        teamId: createdTeam.id,
        permissions: TEAM_PERMISION_OWNER,
        isActive: true,
      }).unwrap()
      .then(() => {
        closeModal();
        toast.success("Team created successfully");
      })
      .catch(() => {
        deleteTeam(createdTeam.id)
        toast.error("Team creation failed!");
      });
    }
  }

  const onSubmit = (data: FormInput): void => {
    createTeam({ name: data.name, description: data.description || '' })
      .unwrap()
      .then(() => {
        setTeamName(data.name)
        setSkip(false)
      })
      .catch(() => {
        toast.error("Team creation failed!");
      });
  };
  
  return (
    <main className='flex min-h-screen flex-col p-6'>
      <Navbar bg='primary' data-bs-theme='dark' expand='lg'>
        <Container>
          <Navbar.Brand href='#'>
            <big>
              <b>Tochly</b>
            </big>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse className='justify-content-end' id='navbarScroll'>
            <Navbar.Text>
              {isAuthenticated ? (
                <Button onClick={showModal} type='button'>CREATE A NEW TEAM</Button>
              ) : (
                <Link href='/auth/login'>Sign in</Link>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isAuthenticated ? (
        <ListGroup>
          {userTeams?.map(team => (
            <ListGroup.Item>{team.name}</ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <>Non logged in Details</>
      )}

      <Modal
        show={show}
        onHide={closeModal}
        backdrop='static'
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FormGroup 
              label='Name'
              fieldName='name'
              type='text'
              md='12'
              hasValidation
              register={register('name')}
              inputError={errors.name as FormInputError}
              placeholder="Team Name"
              classNameInput='border-secondary'
            />
            <FormGroup 
              label='Description'
              fieldName='description'
              type='textarea'
              md='12'
              hasValidation
              register={register('description')}
              inputError={errors.description as FormInputError}
              classNameInput='border-secondary'
              textArea
            />
            
            <div className='d-flex w-100'>
              <Button variant='secondary' onClick={closeModal}>
                Close
              </Button>
              <SpinningButton
                name='Create'
                isLoading={isCreatingTeam || isCreatingTeamMember || isDeletingTeam}
                variant='primary'
                className='ms-auto waves-effect waves-light'
                type='submit'
              />
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </main>
  );
}
