import { Button, Spinner } from 'reactstrap';
import type { ButtonProps } from 'reactstrap';

type Props = ButtonProps & {
  isLoading: boolean;
};

const SpinningButton: React.FC<Props> = ({ name, isLoading, ...others }) => {
  return (
    <Button disabled={isLoading} {...others}>
      {isLoading ? (
        <Spinner animation="border" variant="light" size="sm" />
      ) : (
        name
      )}
    </Button>
  );
};

export default SpinningButton;