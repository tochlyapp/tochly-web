import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ForgetPassword from 'src/pages/auth/ForgetPassword';
import { ToastContainer } from 'react-toastify';
import { useResetPasswordMutation } from 'src/redux/services/auth';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock auth API
jest.mock('src/redux/services/authAPI', () => ({
  useResetPasswordMutation: jest.fn(),
}));

// Mock app selector
jest.mock('src/redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

describe('ForgetPassword Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});

  const mockResetPassword = jest.fn();

  beforeEach(() => {
    (useResetPasswordMutation as jest.Mock).mockReturnValue([
      mockResetPassword,
      { isLoading: false },
    ]);
    mockResetPassword.mockReset();
  });

  it('renders the form with all elements', async () => {
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: false });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgetPassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: false });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgetPassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    act(() => fireEvent.click(screen.getByText('Reset')));

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  it('submits the form and shows success message on valid data', async () => {
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: false });

    mockResetPassword.mockReturnValue({
      unwrap: jest.fn().mockResolvedValueOnce({}),
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgetPassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
    });

    act(() => fireEvent.click(screen.getByText('Reset')));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(screen.getByText('Request sent! Check your email for reset link')).toBeInTheDocument();
    });
  });

  it('shows error message on failed form submission', async () => {
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: false });

    mockResetPassword.mockReturnValue({
      unwrap: jest.fn().mockRejectedValueOnce(new Error('Reset failed')),
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgetPassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
      });
    });

    act(() => fireEvent.click(screen.getByText('Reset')));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(screen.getByText('Unable to send password reset link')).toBeInTheDocument();
    });
  });

  it('redirects to home page if already authenticated', async () => {
    const { useAppSelector } = jest.requireMock('src/redux/hooks');
    useAppSelector.mockReturnValue({ isAuthenticated: true });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgetPassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
    });
  });
});
