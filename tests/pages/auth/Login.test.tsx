import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ToastContainer } from 'react-toastify';

import Login from 'src/pages/auth/Login';
import { useLoginMutation } from 'src/redux/services/auth';
import { setAuth } from 'src/redux/slices/auth';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Redux hooks
jest.mock('src/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Mock auth API
jest.mock('src/redux/services/authAPI', () => ({
  useLoginMutation: jest.fn(),
}));

describe('Login Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});
  const mockDispatch = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock useLoginMutation
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin, { isLoading: false }]);

    // Mock Redux hooks
    const { useAppDispatch, useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppDispatch.mockReturnValue(mockDispatch);
    useAppSelector.mockReturnValue({ isAuthenticated: false });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

  it('renders the login form', () => {
    renderComponent();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('validates input fields', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Please Enter Your Email')).toBeInTheDocument();
      expect(screen.getByText('Please Enter Your Password')).toBeInTheDocument();
    });
  });

  it('calls login API and navigates on success', async () => {
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValueOnce({}),
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockDispatch).toHaveBeenCalledWith(setAuth());
      expect(screen.getByText('Logged in successfully')).toBeInTheDocument();
    });
  });

  it('shows error toast on invalid credentials', async () => {
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockRejectedValueOnce({status: 401}),
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows error toast on unexpected error', async () => {
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockRejectedValueOnce(new Error('Unexpected failed')),
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });
  });

  it('redirects to home page if already authenticated', () => {
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: true });

    renderComponent();

    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });
});
