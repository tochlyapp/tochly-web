'use client';

import Link from 'next/link';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

import Header from '@/app/auth/components/Header';


type FormInput = {
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const schema = yup.object().shape({
    email: yup.string().email('Enter correct email').required('required'),
    password: yup.string().required('required').min(8).max(50)
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: yupResolver(schema) });

  const onSubmit = (data: FormInput): void => {
    console.log(data)
  }
  
  return (
    <div className="my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Header title='Sign in' description='Sign in to continue to Tochly.' />
            <Card>
              <CardBody className="p-4">
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group as={Col} md="12" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <InputGroup className="input-group bg-soft-light rounded-3 mb-3" hasValidation>
                      <span className="input-group-text text-muted">
                        <i className="ri-mail-line" />
                      </span>
                      <Form.Control {...register("email")} type="text" placeholder="Email" isInvalid={errors.email ? true : false} />
                        {errors.email && (
                          <Form.Control.Feedback type="invalid">
                            {errors.email.message}
                          </Form.Control.Feedback>
                        )}
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} md="12" controlId="password">
                    <div className="float-end">
                      <Link href="/auth/forget-password" className="text-muted font-size-13">Forgot password?</Link>
                    </div>
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="input-group bg-soft-light rounded-3 mb-3" hasValidation>
                      <span className="input-group-text text-muted">
                      <i className="ri-lock-2-line" />
                      </span>
                      <Form.Control {...register("password")} type="password" placeholder="Password" isInvalid={errors.password ? true : false} />
                        {errors.password && (
                          <Form.Control.Feedback type="invalid">
                            {errors.password.message}
                          </Form.Control.Feedback>
                        )}
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" className=" waves-effect waves-light" type="submit">
                      Login
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <div className="mt-5 text-center">
              <p>Don't have an account ? <Link href="/auth/register" className="font-weight-medium text-primary">Signup now</Link> </p>
              <p>© {new Date().getFullYear()} Tochly.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register;
