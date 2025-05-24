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
  NavItem,
} from 'reactstrap';

import CreateTeam from 'src/pages/team/CreateTeam';
import { useAppSelector } from 'src/redux/hooks';

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <Navbar color="primary" dark expand="lg" className="custom-navbar shadow-sm py-3">
      <Container>
      <NavbarBrand tag={Link} to="/" className="fw-bold fs-4 text-white">
        Tochly
      </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} aria-label="Toggle navigation" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto align-items-center" navbar>
            <NavItem>
              <NavbarText>
                {isAuthenticated ? (
                  <CreateTeam />
                ) : (
                  <Link to="/auth/login" className="text-white fw-semibold nav-link-style">
                    Sign in
                  </Link>
                )}
              </NavbarText>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
