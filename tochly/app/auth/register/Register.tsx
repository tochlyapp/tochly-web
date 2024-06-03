"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import { Header, SocialButtons } from "@/app/auth/components";
import { SpinningButton } from "@/app/components";

import { useSignUpMutation } from "@/redux/services/authAPI";


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
    firstName: yup.string().required("required").min(1).max(20),
    lastName: yup.string().required("required").min(1).max(20),
    email: yup.string().email("Enter correct email").required("required"),
    password: yup.string().required("required").min(8).max(50),
    rePassword: yup.string().required("required").min(8).max(50),
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
      router.push("/auth/login");
    })
    .catch(() => {
      toast.error("Account registration failed!");
    });
  };

  return (
    <div className="my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Header
              title="Register"
              description="Get your Tochly account now."
            />
            <Card>
              <CardBody className="p-4">
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Form.Group as={Col} md="6" controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <InputGroup
                        className="input-group bg-soft-light rounded-3 mb-3"
                        hasValidation
                      >
                        <span className="input-group-text text-muted">
                          <i className="ri-user-2-line" />
                        </span>
                        <Form.Control
                          {...register("firstName")}
                          type="text"
                          placeholder="First Name"
                          isInvalid={errors.firstName ? true : false}
                        />
                        {errors.firstName && (
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName.message}
                          </Form.Control.Feedback>
                        )}
                      </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <InputGroup
                        className="input-group bg-soft-light rounded-3 mb-3"
                        hasValidation
                      >
                        <span className="input-group-text text-muted">
                          <i className="ri-user-2-line" />
                        </span>
                        <Form.Control
                          {...register("lastName")}
                          type="text"
                          placeholder="Last Name"
                          isInvalid={errors.lastName ? true : false}
                        />
                        {errors.lastName && (
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName.message}
                          </Form.Control.Feedback>
                        )}
                      </InputGroup>
                    </Form.Group>
                  </Row>

                  <Form.Group as={Col} md="12" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <InputGroup
                      className="input-group bg-soft-light rounded-3 mb-3"
                      hasValidation
                    >
                      <span className="input-group-text text-muted">
                        <i className="ri-mail-line" />
                      </span>
                      <Form.Control
                        {...register("email")}
                        type="text"
                        placeholder="Email"
                        isInvalid={errors.email ? true : false}
                      />
                      {errors.email && (
                        <Form.Control.Feedback type="invalid">
                          {errors.email.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} md="12" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup
                      className="input-group bg-soft-light rounded-3 mb-3"
                      hasValidation
                    >
                      <span className="input-group-text text-muted">
                        <i className="ri-lock-2-line" />
                      </span>
                      <Form.Control
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        isInvalid={errors.password ? true : false}
                      />
                      {errors.password && (
                        <Form.Control.Feedback type="invalid">
                          {errors.password.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} md="12" controlId="rePassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup
                      className="input-group bg-soft-light rounded-3 mb-3"
                      hasValidation
                    >
                      <span className="input-group-text text-muted">
                        <i className="ri-lock-2-line" />
                      </span>
                      <Form.Control
                        {...register("rePassword")}
                        type="password"
                        placeholder="Retype Password"
                        isInvalid={errors.rePassword ? true : false}
                      />
                      {errors.password && (
                        <Form.Control.Feedback type="invalid">
                          {errors.password.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid">
                    <SpinningButton
                      name="Register"
                      isLoading={isLoading}
                      variant="primary"
                      className=" waves-effect waves-light"
                      type="submit"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-muted mb-0">
                      By registering you agree to the Tochly
                      <Link href="#" className="text-primary">
                        {" "}
                        Terms of Use
                      </Link>
                    </p>
                  </div>
                </Form>
              </CardBody>
            </Card>
            
            <SocialButtons type="Signup" />

            <div className="mt-5 text-center">
              <p>
                Already have an account ?{" "}
                <Link
                  href="/auth/login"
                  className="font-weight-medium text-primary"
                >
                  Signin
                </Link>{" "}
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
