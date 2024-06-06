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

import { useSignUpMutation } from '@/redux/services/authAPI';

import { FormInputError } from '@/app/types';


type FormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
};

const Register: React.FC = () => {
  const router = useRouter();
  const [signUp, { isLoading }] = useSignUpMutation();

  const schema = yup.object().shape({
    firstName: yup.string().required('required').min(1).max(20),
    lastName: yup.string().required("required").min(1).max(20),
    email: yup.string().email("Enter correct email").required('required'),
    password: yup.string().required('required').min(8).max(50),
    rePassword: yup.string().required('required').min(8).max(50),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: yupResolver(schema) });

  const onSubmit = (data: FormInput): void => {
    signUp({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      re_password: data.rePassword,
    })
    .unwrap()
    .then(() => {
      toast.success(
        "Registered successfully! Check you email and verify your account"
      );
      router.push('/auth/login');
    })
    .catch(() => {
      toast.error("Account registration failed!");
    });
  };

  return (
    <div className='my-5 pt-sm-5'>
      <Container>
        <Row className='justify-content-center'>
          <Col md={8} lg={6} xl={5}>
            <Header
              title="Register"
              description="Get your Tochly account now."
            />
            <Card>
              <CardBody className="p-4">
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <FormGroup 
                      label="First Name"
                      fieldName='firstName'
                      type='text'
                      md='6'
                      hasValidation
                      register={register('firstName')}
                      inputError={errors.firstName as FormInputError}
                      placeholder="First Name"
                      classNameInputIcon='ri-user-2-line'
                    />
                    <FormGroup 
                      label="Last Name"
                      fieldName='lastName'
                      type='text'
                      md='6'
                      hasValidation
                      register={register('lastName')}
                      inputError={errors.lastName as FormInputError}
                      placeholder="Last Name"
                      classNameInputIcon='ri-user-2-line'
                    />
                  </Row>

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
                  <FormGroup 
                    label="Confirm Password"
                    fieldName='rePassword'
                    type='password'
                    md='12'
                    hasValidation
                    register={register('rePassword')}
                    inputError={errors.rePassword as FormInputError}
                    placeholder="Confirm Password"
                    classNameInputIcon='ri-lock-2-line'
                  />

                  <div className='d-grid'>
                    <SpinningButton
                      name='Register'
                      isLoading={isLoading}
                      variant='primary'
                      className='waves-effect waves-light'
                      type='submit'
                    />
                  </div>
                  <div className='mt-4 text-center'>
                    <p className='text-muted mb-0'>
                      By registering you agree to the Tochly
                      <Link href='#' className='text-primary'>
                        {' '}
                        Terms of Use
                      </Link>
                    </p>
                  </div>
                </Form>
              </CardBody>
            </Card>
            
            <SocialButtons type='Signup' />

            <div className='mt-5 text-center'>
              <p>
                Already have an account ?{' '}
                <Link
                  href='/auth/login'
                  className='font-weight-medium text-primary'
                >
                  Signin
                </Link>{' '}
              </p>
              <p>© {new Date().getFullYear()} Tochly.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
