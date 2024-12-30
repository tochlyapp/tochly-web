import { Button } from 'reactstrap';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

type Props = {
  provider: 'Google' | 'Facebook';
  type: 'Signin' | 'Signup';
  [others: string]: any;
};

const SocialButton: React.FC<Props> = ({ provider, type, ...others }) => {
  return (
    <Button
      size="lg"
      className={`social-btn ${provider === 'Google' ? "google-btn" : "facebook-btn"}`}
      {...others}
    >
      {provider === "Google" ? (
        <FaGoogle size={30} className="me-2" />
      ) : (
        <FaFacebook size={30} className="me-2" />
      )}
      {`${type} with ${provider}`}
    </Button>
  );
};

export default SocialButton;
