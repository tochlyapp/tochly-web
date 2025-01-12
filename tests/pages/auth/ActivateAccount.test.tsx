import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useParams } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { ToastContainer } from 'react-toastify';
import { useActivateMutation } from 'src/redux/services/authAPI';
import ActivateAccount from 'src/pages/auth/ActivateAccount';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('src/redux/services/authAPI', () => ({
  useActivateMutation: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

describe('ActivateAccount Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});

  const mockActivate = jest.fn(() => Promise.resolve());
  const mockUnwrap = jest.fn();

  beforeEach(() => {
    jest.mocked(useParams).mockReturnValue({ uid: '123', token: 'abc' });

    (useActivateMutation as jest.Mock).mockReturnValue([
      jest.fn(() => ({
        unwrap: mockUnwrap,
      })),
    ]);
    mockActivate.mockReset();
    mockUnwrap.mockReset();
    mockNavigate.mockReset();
  });

  it('renders the activation header', async () => {
    mockUnwrap.mockResolvedValueOnce({});

    await act(async () => render(
      <Provider store={store}>
        <BrowserRouter>
          <ActivateAccount />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    ));

    expect(screen.getByText('Activating your account...')).toBeInTheDocument();
  });

  it('calls activate mutation and navigates on success', async () => {
    mockUnwrap.mockResolvedValueOnce({});

    
    await act(async () => render(
      <Provider store={store}>
        <BrowserRouter>
          <ActivateAccount />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    ));

    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    expect(screen.getByText('Account activated successfully!')).toBeInTheDocument();
  });

  it('displays error toast and navigates on failure', async () => {
    mockUnwrap.mockRejectedValueOnce(new Error('Activation failed'));

    await act(async () => render(
      <Provider store={store}>
        <BrowserRouter>
          <ActivateAccount />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    ));

    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    expect(screen.getByText('Account activation failed')).toBeInTheDocument();
  });

  it('shows an error and redirects if uid or token is missing', async () => {
    mockUnwrap.mockResolvedValueOnce({});
    jest.mocked(useParams).mockReturnValue({ uid: '', token: '' });

    await act(async () => render(
      <Provider store={store}>
        <BrowserRouter>
          <ActivateAccount />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    ));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    expect(screen.getByText('Invalid activation parameters.')).toBeInTheDocument();
  });
});
