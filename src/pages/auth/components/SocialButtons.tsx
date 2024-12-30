import { Col, Container, Row } from 'reactstrap';

import SocialButton from 'src/pages/auth/components/SocialButton';
import { continueWithGoogle, continueWithFacebook } from 'src/pages/auth/utils';

type Props = {
  type: 'Signin' | 'Signup';
};

const SocialButtons: React.FC<Props> = ({ type }) => {
  return (
    <Container>
      <Row>
        <Col sm={6} md={6} lg={6} xl={6}>
          <SocialButton
            provider="Google"
            type={type}
            onClick={continueWithGoogle}
          />
        </Col>
        <Col sm={6} md={6} lg={6} xl={6}>
          <SocialButton
            provider="Facebook"
            type={type}
            onClick={continueWithFacebook}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SocialButtons;
