import { Container, Spinner } from 'reactstrap';

import { useSocialAuthenticateMutation } from 'src/redux/services/auth';
import { useSocialAuth } from 'src/pages/auth/hooks';

const Facebook = () => {
  const [facebookAuthenticate] = useSocialAuthenticateMutation();
  useSocialAuth('facebook', facebookAuthenticate);

  return (
    <Container className="justify-content-center text-center mt-5">
      <Spinner animation="border" />
    </Container>
  );
};

export default Facebook;
