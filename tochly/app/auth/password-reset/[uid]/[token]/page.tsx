'use client';

import { useRouter } from 'next/navigation';

import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Header } from '@/app/auth/components';
import { SpinningButton } from '@/app/components';

import { useResetPasswordConfirmMutation } from '@/redux/services/authAPI';


type Props = {
  params: {
    uid: string;
    token: string;
  };
};

type FormInput = {
  newPassword: string;
  reNewPassword: string;
};

const PasswordReset: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const [resetPasswordConfirm, { isLoading }] =
    useResetPasswordConfirmMutation();

  const schema = yup.object().shape({
    newPassword: yup.string().required('required').min(8).max(50),
    reNewPassword: yup.string().required('required').min(8).max(50),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: yupResolver(schema) });

  const onSubmit = (data: FormInput) => {
    const { uid, token } = params;
    resetPasswordConfirm({
      uid,
      token,
      new_password: data.reNewPassword,
      re_new_password: data.reNewPassword,
    })
      .unwrap()
      .then(() => {
        toast.success("Password reset successfully!");
      })
      .catch(() => {
        toast.error("Password resetting failed");
      })
      .finally(() => {
        router.push('/auth/login');
      });
  };
  return (
    <div className='my-5 pt-sm-5'>
      <Container>
        <Row className='justify-content-center'>
          <Col md={8} lg={6} xl={5}>
            <Header
              title="Password Reset"
              description="Enter new password below"
            />
            <Card>
              <CardBody className='p-4'>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group as={Col} md='12'>
                    <Form.Label>New Password</Form.Label>
                    <InputGroup
                      className='input-group bg-soft-light rounded-3 mb-3'
                      hasValidation
                    >
                      <span className='input-group-text text-muted'>
                        <i className='ri-lock-2-line' />
                      </span>
                      <Form.Control
                        {...register('newPassword')}
                        type='text'
                        placeholder="New Password"
                        isInvalid={errors.newPassword ? true : false}
                      />
                      {errors.newPassword && (
                        <Form.Control.Feedback type='invalid'>
                          {errors.newPassword.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} md='12' controlId='reNewPassword'>
                    <Form.Label>Confirm New Password</Form.Label>
                    <InputGroup
                      className='input-group bg-soft-light rounded-3 mb-3'
                      hasValidation
                    >
                      <span className='input-group-text text-muted'>
                        <i className='ri-lock-2-line' />
                      </span>
                      <Form.Control
                        {...register('reNewPassword')}
                        type='text'
                        placeholder="Confirm New Password"
                        isInvalid={errors.newPassword ? true : false}
                      />
                      {errors.reNewPassword && (
                        <Form.Control.Feedback type='invalid'>
                          {errors.reNewPassword.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>
                  <div className='d-grid'>
                    <SpinningButton
                      name='Reset'
                      isLoading={isLoading}
                      variant='primary'
                      className='waves-effect waves-light'
                      type='submit'
                    />
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordReset;
