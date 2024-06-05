import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import SocialButton from '@/app/auth/components/SocialButton';
import { continueWithGoogle, continueWithFacebook } from '@/app/auth/utils';


type Props = {
  type: 'Signin' | 'Signup';
};

const SocialButtons: React.FC<Props> = ({ type }) => {
  return (
    <Container>
      <Row>
        <Col sm={6} md={6} lg={6} xl={6}>
          <SocialButton
            provider='Google'
            type={type}
            onClick={continueWithGoogle}
          />
        </Col>
        <Col sm={6} md={6} lg={6} xl={6}>
          <SocialButton
            provider='Facebook'
            type={type}
            onClick={continueWithFacebook}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SocialButtons;
