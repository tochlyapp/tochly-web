import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialButton from 'src/pages/auth/components/SocialButton';

describe('SocialButton Component', () => {
  it('renders Google Signin button correctly', () => {
    render(<SocialButton provider="Google" type="Signin" />);

    const button = screen.getByLabelText('social-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('social-btn google-btn');
    expect(button).toHaveTextContent('Signin with Google');
    expect(button.querySelector('svg')).toBeTruthy(); // Ensure the Google icon is rendered
  });

  it('renders Facebook Signup button correctly', () => {
    render(<SocialButton provider="Facebook" type="Signup" />);

    const button = screen.getByLabelText('social-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('social-btn facebook-btn');
    expect(button).toHaveTextContent('Signup with Facebook');
    expect(button.querySelector('svg')).toBeTruthy(); // Ensure the Facebook icon is rendered
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<SocialButton provider="Google" type="Signin" onClick={handleClick} />);

    const button = screen.getByLabelText('social-button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies additional props correctly', () => {
    render(<SocialButton provider="Facebook" type="Signup" disabled />);

    const button = screen.getByLabelText('social-button');
    expect(button).toBeDisabled();
  });
});
