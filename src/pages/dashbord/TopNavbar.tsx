import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  NavbarText,
  Container,
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
        <NavbarBrand href="/">
          <big>
            <b>Tochly</b>
          </big>
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <NavbarText>
            {isAuthenticated ? (
              <CreateTeam />
            ) : (
              <Link to="/auth/login" className="text-white">
                Sign in
              </Link>
            )}
          </NavbarText>
        </Collapse>
      </Container>
    </Navbar>
  );
}
