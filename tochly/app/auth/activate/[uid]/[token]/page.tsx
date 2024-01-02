"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { toast } from "react-toastify";


import { Header } from "@/app/auth/components";

import { useActivateMutation } from "@/redux/services/authAPI";


type Props = {
  params: {
    uid: string;
    token: string;
  }
}

const Activation: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const [activation] = useActivateMutation();

  useEffect(() => {
    const { uid, token } = params
    activation({ uid, token })
    .unwrap()
    .then(() => {
      toast.success("Account activated successfully!")
    })
    .catch(() => {
      toast.error("Account activation failed")
    })
    .finally(() => {
      router.push("/auth/login")
    })
  }, [])
  return (
    <div className="my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Header
              title="Activating your account..."
              description=""
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Activation;
