import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  NavbarText,
  Container,
  Nav,
} from 'reactstrap';

import CreateTeam from 'src/pages/team/CreateTeam';
import { useAppSelector } from 'src/redux/hooks';

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <Navbar color="primary" dark expand="lg">
      <Container>
        <NavbarBrand tag={Link} to="/">
          <big>
            <b>Tochly</b>
          </big>
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} aria-label="Toggle navigation" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavbarText>
              {isAuthenticated ? (
                <CreateTeam />
              ) : (
                <Link to="/auth/login" className="text-white">
                  Sign in
                </Link>
              )}
            </NavbarText>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
