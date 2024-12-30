import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Form,
} from 'reactstrap';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { Header } from 'src/pages/auth/components';
import { FormIputGroup, SpinningButton } from 'src/components';

import { useAppSelector } from 'src/redux/hooks';
import { useResetPasswordMutation } from 'src/redux/services/authAPI';

type FormInput = {
  email: string;
};

const ForgetPassword = () => {
  const { t } = useTranslation();
  const [resetPassword] = useResetPasswordMutation()

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
    }),
    onSubmit: (data: FormInput) => {
      resetPassword({ email: data.email })
      .unwrap()
      .then(() => {
        toast.success(t('Request sent! Check your email for reset link'))
      })
      .catch(() => {
        toast.error(t('Unable to send password reset link'))
      });
    },
  });

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Reset Password | Tochly</title>
        <meta name="description" content={t("Tochly password reset page")} />
      </Helmet>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header
                title={t("Reset Password")}
                description={t("Reset Password With Tochly.")}
              />
              <Card>
                <CardBody className="p-4">
                  <div className="p-3">
                    <Alert color="info" className="text-center mb-4">
                      {t("Enter your Email and instructions will be sent to you")}!
                    </Alert>
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="mb-4">
                        <FormIputGroup
													label={t("Email")}
													fieldName="email'"
													type="text"
													value={formik.values.email}
													inputError={formik.errors.email}
													placeholder={t("Enter email")}
													classNameGroup="mb-3 bg-soft-light rounded-3"
													classNameInput="form-control form-control-lg border-light bg-soft-light"
													classNameInputIcon="ri-mail-line"
													invalid={!!(formik.touched.email && formik.errors.email)}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
												/>
                      </div>
                      <div className="d-grid">
                        <SpinningButton
                          name='Reset'
                          isLoading={false}
                          color="primary"
                          className="waves-effect waves-light"
                          type="submit"
                        />
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  {t("Remember It")}?{' '}
                  <Link to="/auth/login" className="font-weight-medium text-primar">
                      {t("Signin")}
                  </Link>
                </p>
                <p>
                  © {new Date().getFullYear()} Tochly.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ForgetPassword;
