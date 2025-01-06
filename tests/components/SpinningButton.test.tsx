import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SpinningButton from 'src/components/SpinningButton';

test('renders spinner when loading', () => {
  render(<SpinningButton isLoading={true} buttonText="Submit" />);

  expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner has role 'status'
  expect(screen.getByRole('button')).toBeDisabled();
});

test('renders text when not loading', () => {
  render(<SpinningButton isLoading={false} buttonText="Submit" />);

  expect(screen.getByText('Submit')).toBeInTheDocument();
  expect(screen.getByRole('button')).not.toBeDisabled();
});

test('calls onClick handler when clicked', () => {
  const handleClick = jest.fn();
  render(<SpinningButton isLoading={false} buttonText="Submit" onClick={handleClick} />);

  fireEvent.click(screen.getByText('Submit'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
