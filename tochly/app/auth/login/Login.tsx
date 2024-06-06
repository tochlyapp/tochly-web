'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { Header, SocialButtons } from '@/app/auth/components';
import { SpinningButton, FormGroup } from '@/app/components';

import { useLoginMutation } from '@/redux/services/authAPI';

import { FormInputError } from '@/app/types';


type FormInput = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const schema = yup.object().shape({
    email: yup.string().email("Enter correct email").required('required'),
    password: yup.string().required('required').min(8).max(50),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: yupResolver(schema) });

  const onSubmit = (data: FormInput): void => {
    login({ email: data.email, password: data.password })
      .unwrap()
      .then(() => {
        toast.success("Logged in successfully");
        router.push('/');
      })
      .catch(() => {
        toast.error("Login failed!");
      });
  };

  return (
    <div className='my-5 pt-sm-5'>
      <Container>
        <Row className='justify-content-center'>
          <Col md={8} lg={6} xl={5}>
            <Header
              title="Sign in"
              description="Sign in to continue to Tochly."
            />
            <Card>
              <CardBody className='p-4'>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup 
                    label='Email'
                    fieldName='email'
                    type='text'
                    md='12'
                    hasValidation
                    register={register('email')}
                    inputError={errors.email as FormInputError}
                    placeholder='Email'
                    classNameInputIcon='ri-mail-line'
                  />
                  <div className='float-end'>
                    <Link
                      href='/auth/password-reset'
                      className='text-muted font-size-13'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormGroup 
                    label='Password'
                    fieldName='password'
                    type='password'
                    md='12'
                    hasValidation
                    register={register('password')}
                    inputError={errors.password as FormInputError}
                    placeholder='Password'
                    classNameInputIcon='ri-lock-2-line'
                  />

                  <div className='d-grid'>
                    <SpinningButton
                      name='Login'
                      isLoading={isLoading}
                      variant='primary'
                      className='waves-effect waves-light'
                      type='submit'
                    />
                  </div>
                </Form>
              </CardBody>
            </Card>
            
            <div className='ms-1'>
              <SocialButtons type='Signin' />
            </div>

            <div className='mt-5 text-center'>
              <p>
                {`Don't have an account ? `}
                <Link
                  href='/auth/register'
                  className='font-weight-medium text-primary'
                >
                  Signup now
                </Link>
              </p>
              <p>© {new Date().getFullYear()} Tochly.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
