import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ToastContainer } from 'react-toastify';
import ChangePassword from 'src/pages/auth/ChangePassword';
import { useResetPasswordConfirmMutation } from 'src/redux/services/authAPI';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock API hook
jest.mock('src/redux/services/authAPI', () => ({
  useResetPasswordConfirmMutation: jest.fn(),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

describe('ChangePassword Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});
  const mockResetPasswordConfirm = jest.fn();

  beforeEach(() => {
    (useResetPasswordConfirmMutation as jest.Mock).mockReturnValue([
      mockResetPasswordConfirm,
      { isLoading: false },
    ]);
    mockResetPasswordConfirm.mockReset();
    mockNavigate.mockReset();
  });

  it('redirects to /auth/login if uid or token is missing', async () => {
    const { useParams } = jest.requireMock('react-router-dom');
    useParams.mockReturnValue({ uid: '', token: '' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/auth/login'));
  });

  it('renders the form when uid and token are provided', async () => {
    const { useParams } = jest.requireMock('react-router-dom');
    useParams.mockReturnValue({ uid: '123', token: 'abc' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Password Reset')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    const { useParams } = jest.requireMock('react-router-dom');
    useParams.mockReturnValue({ uid: '123', token: 'abc' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangePassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(screen.getByLabelText('new-password-error')).toBeInTheDocument();
      expect(screen.getByLabelText('re-new-password-error')).toBeInTheDocument();
    });
  });

  it('submits the form and shows success message on valid data', async () => {
    const { useParams } = jest.requireMock('react-router-dom');
    useParams.mockReturnValue({ uid: '123', token: 'abc' });

    mockResetPasswordConfirm.mockReturnValue({
      unwrap: jest.fn().mockResolvedValueOnce({}),
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangePassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { value: 'newpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
      target: { value: 'newpassword' },
    });
    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(mockResetPasswordConfirm).toHaveBeenCalledWith({
        uid: '123',
        token: 'abc',
        new_password: 'newpassword',
        re_new_password: 'newpassword',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
      expect(screen.getByText('Password reset successfully!')).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    const { useParams } = jest.requireMock('react-router-dom');
    useParams.mockReturnValue({ uid: '123', token: 'abc' });

    mockResetPasswordConfirm.mockReturnValue({
      unwrap: jest.fn().mockRejectedValueOnce(new Error('Reset failed')),
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangePassword />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { value: 'newpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
      target: { value: 'newpassword' },
    });
    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(mockResetPasswordConfirm).toHaveBeenCalledWith({
        uid: '123',
        token: 'abc',
        new_password: 'newpassword',
        re_new_password: 'newpassword',
      });
      expect(screen.getByText('Password resetting failed')).toBeInTheDocument();
    });
  });
});
