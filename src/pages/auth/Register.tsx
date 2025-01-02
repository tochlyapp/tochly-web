import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form
} from 'reactstrap';
import { Helmet } from 'react-helmet';

import { useAppSelector } from 'src/redux/hooks';
import { useSignUpMutation } from 'src/redux/services/authAPI';

import { Header, SocialButtons } from 'src/pages/auth/components';
import { FormInputGroup, SpinningButton } from 'src/components';

type FormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [signUp, { isLoading }] = useSignUpMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rePassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('Required')).max(50),
      lastName: Yup.string().required(t('Required')).max(50),
      email: Yup.string().email(t('Enter a valid email')).required(t('Required')),
      password: Yup.string().required(t('Required')).max(50),
      rePassword: Yup.string().required(t('Required')).min(8).max(50),
    }),
    onSubmit: (data: FormInput) => {
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
          t('Registered successfully! Check your email and verify your account')
        );
        navigate('/auth/login');
      })
      .catch((error) => {
        console.log('error', error)
        toast.error(t('Account registration failed!'));
      });
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Register | Tochly</title>
        <meta name="description" content="Tochly sign up page" />
      </Helmet>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header
                title={t("Register")}
                description={t("Get your Tochly account now")}
              />
              <Card>
                <CardBody className="p-4">
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <FormInputGroup
                        label={t("First Name")}
                        fieldName="firstName"
                        type="text"
                        value={formik.values.firstName}
                        inputError={formik.errors.firstName}
                        md="6"
                        placeholder="First Name"
                        classNameGroup="input-group bg-soft-light rounded-3 mb-3"
                        classNameInput="form-control form-control-lg border-light bg-soft-light"
                        classNameInputIcon="ri-user-2-line"
                        invalid={!!(formik.touched.firstName && formik.errors.firstName)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <FormInputGroup
                        label={t("Last Name")}
                        fieldName="lastName"
                        type="text"
                        value={formik.values.lastName}
                        inputError={formik.errors.lastName}
                        md="6"
                        placeholder="Last Name"
                        classNameGroup="input-group bg-soft-light rounded-3 mb-3"
                        classNameInput="form-control form-control-lg border-light bg-soft-light"
                        classNameInputIcon="ri-user-2-line"
                        invalid={!!(formik.touched.email && formik.errors.email)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Row>
                    <div className="mb-3">
                      <FormInputGroup
                        label={t("Email")}
                        fieldName="email"
                        type="text"
                        value={formik.values.email}
                        inputError={formik.errors.email}
                        placeholder="Email"
                        classNameGroup="input-group bg-soft-light rounded-3 mb-3"
                        classNameInput="form-control form-control-lg border-light bg-soft-light"
                        classNameInputIcon="ri-mail-line"
                        invalid={!!(formik.touched.email && formik.errors.email)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="mb-3">
                      <FormInputGroup
                        label={t("Password")}
                        fieldName="password"
                        type="password"
                        value={formik.values.password}
                        inputError={formik.errors.password}
                        placeholder="Enter Password"
                        classNameGroup="input-group bg-soft-light rounded-3 mb-3"
                        classNameInput="form-control form-control-lg border-light bg-soft-light"
                        classNameInputIcon="ri-lock-2-line"
                        invalid={!!(formik.touched.email && formik.errors.password)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="mb-4">
                      <FormInputGroup
                        label={t("Confirm Password")}
                        fieldName="rePassword"
                        type="password"
                        value={formik.values.rePassword}
                        inputError={formik.errors.rePassword}
                        placeholder="Confirm Password"
                        classNameGroup="input-group bg-soft-light rounded-3 mb-3"
                        classNameInput="form-control form-control-lg border-light bg-soft-light"
                        classNameInputIcon="ri-lock-2-line"
                        invalid={!!(formik.touched.email && formik.errors.rePassword)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="d-grid">
                      <SpinningButton
                        name="Register"
                        isLoading={isLoading}
                        color="primary"
                        className="waves-effect waves-light"
                        type="submit"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-muted mb-0">
                        {t("By registering you agree to the Tochly")}{" "}
                        <Link to="#" className="text-primary">
                          {t("Terms of Use")}
                        </Link>
                      </p>
                    </div>
                  </Form>
                </CardBody>
              </Card>

              <SocialButtons type="Signup" />

              <div className="mt-5 text-center">
                <p>
                  {t("Already have an account")}?{' '}
                  <Link to="/auth/login" className="font-weight-medium text-primary">
                    {t("Signin")}
                  </Link>
                </p>
                <p>© {new Date().getFullYear()} Tochly.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
