import { Button, Spinner } from 'reactstrap';
import type { ButtonProps } from 'reactstrap';

type Props = ButtonProps & {
  isLoading: boolean;
  buttonText?: string;
};

const SpinningButton: React.FC<Props> = ({ buttonText, isLoading, ...others }) => (
  <Button disabled={isLoading} {...others}>
    {isLoading ? (
      <Spinner role="status" type="border" color="light" size="sm" />
    ) : (
      buttonText
    )}
  </Button>
);

export default SpinningButton;
