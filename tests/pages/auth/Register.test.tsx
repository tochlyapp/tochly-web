import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ToastContainer } from 'react-toastify';

import Register from 'src/pages/auth/Register';
import { useSignUpMutation } from 'src/redux/services/auth';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Redux hooks
jest.mock('src/redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

// Mock sign-up API
jest.mock('src/redux/services/authAPI', () => ({
  useSignUpMutation: jest.fn(),
}));

describe('Register Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});
  const mockSignUp = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock useSignUpMutation
    (useSignUpMutation as jest.Mock).mockReturnValue([mockSignUp, { isLoading: false }]);

    // Mock Redux hooks
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: false });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

  it('renders the registration form', () => {
    renderComponent();
    expect(screen.getByRole('title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('submit-buttton')).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText('submit-buttton'));

    await waitFor(() => {
      expect(screen.getByLabelText('first-name-error')).toBeInTheDocument();
      expect(screen.getByLabelText('last-name-error')).toBeInTheDocument();
      expect(screen.getByLabelText('email-error')).toBeInTheDocument();
      expect(screen.getByLabelText('password-error')).toBeInTheDocument();
      expect(screen.getByLabelText('re-password-error')).toBeInTheDocument();
    });
  });

  it('calls signUp API and navigates on success', async () => {
    mockSignUp.mockReturnValue({
      unwrap: jest.fn().mockResolvedValueOnce({}),
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByLabelText('submit-buttton'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        re_password: 'password123',
      });
      expect(screen.getByText('Registered successfully! Check your email and verify your account')).toBeInTheDocument();
    });
  });

  it('shows error toast on registration failure', async () => {
    mockSignUp.mockReturnValue({
      unwrap: jest.fn().mockRejectedValueOnce(new Error('Registration failed')),
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByLabelText('submit-buttton'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
      expect(screen.getByText('Account registration failed!')).toBeInTheDocument();
    });
  });

  it('redirects to home page if already authenticated', () => {
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: true });

    renderComponent();

    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });
});
