"use client";

import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { useSocialAuthenticateMutation } from "@/redux/services/authAPI";
import { useSocialAuth } from "@/app/auth/hooks";


const Page = () => {
  const [facebookAuthenticate] = useSocialAuthenticateMutation();
  useSocialAuth("facebook", facebookAuthenticate);

  return (
    <Container className="justify-content-center text-center mt-5">
      <Spinner animation="border" />
    </Container>
  );
};

export default Page;
