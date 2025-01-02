import React from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  FormGroup, 
  Form, 
  Input, 
  Label, 
} from 'reactstrap';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useLoginMutation } from 'src/redux/services/authAPI';
import { setAuth } from 'src/redux/slices/auth';

import { Header, SocialButtons } from 'src/pages/auth/components';
import { FormInputGroup, SpinningButton } from 'src/components';

type FormInput = {
  email: string;
  password: string;
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			email: Yup.string().required(t('Please Enter Your Email')),
			password: Yup.string().required(t('Please Enter Your Password')),
		}),
		onSubmit: (data: FormInput) => {
			login({ email: data.email, password: data.password })
				.unwrap()
				.then(() => {
					dispatch(setAuth());
					toast.success(t('Logged in successfully'));
					navigate('/');
				})
				.catch((error) => {
					if (error?.status === 401) {
						toast.error(t('Invalid credentials'));
					} else {
						toast.error(t('An unexpected error occurred. Please try again.'));
					}
				});
		},
  });

	if (isAuthenticated) {
		return <Navigate to="/" />;
	}
 
  return (
		<React.Fragment>
			<Helmet>
				<title>Login | Tochly</title>
				<meta name="description" content="Tochly sign up page" />
			</Helmet>
			<div className="account-pages my-5 pt-sm-5">
				<Container>
					<Row className="justify-content-center">
						<Col md={8} lg={6} xl={5}>
							<Header 
								title={t("Sign in")} 
								description={t("Sign in to continue to Tochly")} 
							/>
							<Card>
								<CardBody className="p-4">
									<div className="p-3">
										<Form onSubmit={formik.handleSubmit}>
											<div className="mb-3">
												<FormInputGroup
													label={t("Email")}
													fieldName="email"
													type="text"
													value={formik.values.email}
													inputError={formik.errors.email}
													placeholder="Enter email"
													classNameGroup="mb-3 bg-soft-light rounded-3"
													classNameInput="form-control form-control-lg border-light bg-soft-light"
													classNameInputIcon="ri-mail-line"
													invalid={!!(formik.touched.email && formik.errors.email)}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
												/>
											</div>

											<FormGroup className="mb-4">
												<div className="float-end">
													<Link to="/forget-password" className="text-muted font-size-13">
														{t("Forgot password")}?
													</Link>
												</div>

												<FormInputGroup
													label="Password"
													fieldName="password"
													type="password"
													value={formik.values.password}
													inputError={formik.errors.password}
													placeholder="Enter Password"
													classNameGroup="mb-3 bg-soft-light rounded-3"
													classNameInput="form-control form-control-lg border-light bg-soft-light"
													classNameInputIcon="ri-user-2-line"
													invalid={!!(formik.touched.password && formik.errors.password)}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
												/>
											</FormGroup>

											<div className="form-check mb-4">
												<Input type="checkbox" className="form-check-input" id="remember-check" />
												<Label className="form-check-label" htmlFor="remember-check">
													{t("Remember me")}
												</Label>
											</div>

											<div className="d-grid">
												<SpinningButton
													name={t("Login")}
													isLoading={isLoading}
													color="primary"
													className="waves-effect waves-light"
													type="submit"
												/>
											</div>
										</Form>
									</div>
								</CardBody>
							</Card>

							<div className="ms-1">
								<SocialButtons type="Signin" />
							</div>

							<div className="mt-5 text-center">
								<p>
									{t("Don't have an account")} ?{" "}
									<Link to="/auth/register" className="font-weight-medium text-primary">
										{t("Signup now")}
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

export default Login;
