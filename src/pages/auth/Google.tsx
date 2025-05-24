import { Container, Spinner } from 'reactstrap';

import { useSocialAuthenticateMutation } from 'src/redux/services/auth';
import { useSocialAuth } from 'src/pages/auth/hooks';

const Google = () => {
  const [googleAuthenticate] = useSocialAuthenticateMutation();
  useSocialAuth('google-oauth2', googleAuthenticate);

  return (
    <Container className='justify-content-center text-center mt-5'>
      <Spinner animation='border' />
    </Container>
  );
};

export default Google;
