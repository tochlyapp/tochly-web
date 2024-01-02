"use client";

import Link from "next/link";

import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Header } from "@/app/auth/components";
import { SpinningButton } from "@/app/components";

import { useResetPasswordMutation } from "@/redux/services/authAPI";


type FormInput = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const [resetPassword] = useResetPasswordMutation()

  const schema = yup.object().shape({
    email: yup.string().email("Enter correct email").required("required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: yupResolver(schema) });

  const onSubmit = (data: FormInput): void => {
    resetPassword({ email: data.email })
    .unwrap()
    .then(() => {
      toast.success("Request sent! Check your email for reset link")
    })
    .catch((error) => {
      console.log('ERROR', error)
      toast.error("Unable to send password reset link")
    })
  };

  return (
    <div className="my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Header
              title="Reset Password"
              description="Reset Password With Tochly."
            />
            <Card>
              <CardBody className="p-4">
                <Alert variant="info" className="text-center mb-4">
                  Enter your Email and instructions will be sent to you
                </Alert>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="d-grid">
                    <SpinningButton
                      name="Reset"
                      isLoading={false}
                      variant="primary"
                      className=" waves-effect waves-light"
                      type="submit"
                    />
                  </div>
                </Form>
              </CardBody>
            </Card>
            <div className="mt-5 text-center">
              <p>
                {`Remember It ? `}
                <Link
                  href="/auth/login"
                  className="font-weight-medium text-primary"
                >
                  Signin
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

export default ForgotPassword;
