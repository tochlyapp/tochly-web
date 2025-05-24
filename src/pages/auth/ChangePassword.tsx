import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Header } from 'src/pages/auth/components';
import { FormInputGroup, SpinningButton } from 'src/components';

import { useResetPasswordConfirmMutation } from 'src/redux/services/auth';

type FormInput = {
  newPassword: string;
  reNewPassword: string;
};

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { uid, token } = useParams();

  const [
    resetPasswordConfirm, 
    { isLoading }
  ] = useResetPasswordConfirmMutation();

  useEffect(() => {
    if (!uid || !token) {
      toast.error(t('Invalid or missing reset token. Please try again.'));
      navigate('/auth/login');
    }
  }, [uid, token, navigate]);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      reNewPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().required(t('Required')).max(50),
      reNewPassword: Yup.string()
        .required(t('Required'))
        .oneOf([Yup.ref('newPassword')], t('Passwords must match')),
    }),
    onSubmit: (data: FormInput) => {
      resetPasswordConfirm({
        uid,
        token,
        new_password: data.reNewPassword,
        re_new_password: data.reNewPassword,
      })
      .unwrap()
      .then(() => {
        toast.success('Password reset successfully!');
      })
      .catch(() => {
        toast.error('Password resetting failed');
      })
      .finally(() => {
        navigate('/auth/login');
      });
    },
  });

  if (!uid || !token) {
    return null;
  }

  return (  
    <div className="my-5 pt-sm-5">
      <Helmet>
        <title>Reset Password | Tochly</title>
        <meta name="description" content={t("Tochly password reset page")} />
      </Helmet>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Header
              title={t('Password Reset')}
              description={t('Enter new password below')}
            />
            <Card>
              <CardBody className="p-4">
                <Form noValidate onSubmit={formik.handleSubmit}>
                  <FormInputGroup 
                    label={t('New Password')}
                    fieldName="newPassword"
                    type="password"
                    value={formik.values.newPassword}
                    inputError={formik.errors.newPassword}
                    placeholder={t('New Password')}
                    classNameGroup="mb-3 bg-soft-light rounded-3"
										classNameInput="form-control form-control-lg border-light bg-soft-light"
                    classNameInputIcon="ri-lock-2-line"
                    errorAriaLabel="new-password-error"
                    invalid={!!(formik.touched.newPassword && formik.errors.newPassword)}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormInputGroup 
                    label={t('Confirm New Password')}
                    fieldName="reNewPassword"
                    type="password"
                    value={formik.values.reNewPassword}
                    inputError={formik.errors.reNewPassword}
                    placeholder={t('Confirm New Password')}
                    classNameGroup="mb-3 bg-soft-light rounded-3"
										classNameInput="form-control form-control-lg border-light bg-soft-light"
                    classNameInputIcon="ri-lock-2-line"
                    errorAriaLabel="re-new-password-error"
                    invalid={!!(formik.touched.reNewPassword && formik.errors.reNewPassword)}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="d-grid">
                    <SpinningButton
                      buttonText="Reset"
                      isLoading={isLoading}
                      color="primary"
                      className="waves-effect waves-light"
                      type="submit"
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
}

export default ChangePassword;
