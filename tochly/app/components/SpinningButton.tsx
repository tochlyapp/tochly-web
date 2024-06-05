import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import type { ButtonProps } from 'react-bootstrap/Button';


type Props = ButtonProps & {
  isLoading: boolean;
};

const SpinningButton: React.FC<Props> = ({ name, isLoading, ...others }) => {
  return (
    <Button disabled={isLoading} {...others}>
      {isLoading ? (
        <Spinner animation='border' variant='light' size='sm' />
      ) : (
        name
      )}
    </Button>
  );
};

export default SpinningButton;
