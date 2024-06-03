"use client";

import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";


type Props = {
  isAuthenticated: boolean;
};

export default function TopNavbar({ isAuthenticated }: Props) {
  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">
          <big>
            <b>Tochly</b>
          </big>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse className="justify-content-end" id="navbarScroll">
          <Navbar.Text>
            {isAuthenticated ? (
              <Button type="button">CREATE A NEW TEAM</Button>
            ) : (
              <Link href="/auth/login">Sign in</Link>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
