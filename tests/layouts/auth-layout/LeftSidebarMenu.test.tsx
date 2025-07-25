import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeftSidebarMenu from 'src/layouts/auth-layout/LeftSidebarMenu';
import { ChatContext } from 'src/context/ChatContext';
import { BrowserRouter } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import * as authApi from 'src/redux/services/auth';
import * as memberApi from 'src/redux/services/member';
import { toast } from 'react-toastify';

jest.mock('src/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('src/redux/services/auth', () => ({
  __esModule: true,
  useLogoutMutation: jest.fn(),
  usePatchCurrentUserProfileMutation: jest.fn(),
}));

jest.mock('src/redux/services/member', () => ({
  __esModule: true,
  usePatchCurrentTeamMemberMutation: jest.fn(),
}));

jest.mock('src/redux/slices/layout', () => ({
  setActiveTab: jest.fn((tab) => ({ type: 'setActiveTab', payload: tab })),
  changeLayoutMode: jest.fn((mode) => ({ type: 'changeLayoutMode', payload: mode })),
}));

jest.mock('src/redux/slices/auth', () => ({
  logout: jest.fn(() => ({ type: 'logout' })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ tid: 'team-123' }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockDispatch = jest.fn();
const mockLogout = jest.fn(() => ({ unwrap: () => Promise.resolve() }));
const mockPatchProfile = jest.fn(() => ({ unwrap: () => Promise.resolve() }));
const mockPatchMember = jest.fn(() => ({ unwrap: () => Promise.resolve({ online: true }) }));

(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
(useAppSelector as jest.Mock).mockReturnValue({
  layoutMode: 'light',
  activeTab: 'chat',
});

(authApi.useLogoutMutation as jest.Mock).mockReturnValue([mockLogout]);
(authApi.usePatchCurrentUserProfileMutation as jest.Mock).mockReturnValue([mockPatchProfile]);
(memberApi.usePatchCurrentTeamMemberMutation as jest.Mock).mockReturnValue([mockPatchMember]);

const renderWithContext = (overrides = {}) => {
  const defaultContext = {
    currentMember: {
      id: 1,
      display_name: "John Doe",
      full_name: "Johnathan Doe",
      role: 'admin' as 'admin' | 'member',
      title: "Project Manager",
      phone_number: "+1234567890",
      profile_picture_url: "https://example.com/avatars/john_doe.jpg",
      online: true,
      status: '',
    
      user: {
        id: 10,
        email: "johndoe@example.com",
        first_name: "John",
        last_name: "Doe",
        timezone: "Africa/Lagos",
      },
    
      profile: {
        id: 100,
        user: 10,
        email: "johndoe@example.com",
        full_name: "Johnathan Doe",
        dark_mode: true,
      },
    },
    setCurrentMember: jest.fn(),
    activeChatRoom: null,
    setActiveChatRoom: jest.fn(),
    isLoggedInUser: true,
    setIsLoggedInUser: jest.fn(),
  };

  return render(
    <ChatContext.Provider value={{ ...defaultContext, ...overrides }}>
      <BrowserRouter>
        <LeftSidebarMenu />
      </BrowserRouter>
    </ChatContext.Provider>
  );
};

// --- Tests ---

describe('LeftSidebarMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders logo and tabs', () => {
    renderWithContext();
    expect(screen.getByRole('logo')).toBeInTheDocument();
    expect(screen.getByLabelText('chat')).toBeInTheDocument();
  });

  it('toggles language dropdown and selects language', () => {
    renderWithContext();
    const globe = screen.getByLabelText('global-icon');
    fireEvent.click(globe);

    const spanishOption = screen.getByText('Spanish');
    fireEvent.click(spanishOption);

    expect(screen.getByText('Spanish')).toBeInTheDocument();
  });

  it('toggles layout mode', async () => {
    renderWithContext();
    const layoutToggle = screen.getByLabelText('light-dark');
    fireEvent.click(layoutToggle);

    await waitFor(() => {
      expect(mockPatchProfile).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('logs out after confirmation', async () => {
    global.confirm = jest.fn(() => true); // simulate "OK" on confirm

    renderWithContext();

    const avatar = screen.getByAltText('user');
    fireEvent.click(avatar);

    const logoutOption = screen.getByText('Log out');
    fireEvent.click(logoutOption);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('toggles online status', async () => {
    renderWithContext();

    const avatar = screen.getByAltText('user');
    fireEvent.click(avatar);

    const toggleStatus = screen.getByText('Go Offline');
    fireEvent.click(toggleStatus);

    await waitFor(() => {
      expect(mockPatchMember).toHaveBeenCalled();
      expect(toast.info).toHaveBeenCalledWith('You are now Offline');
    });
  });

  it('switches tabs and updates localStorage', () => {
    renderWithContext();
    const profileTab = screen.getByLabelText('profile');
    fireEvent.click(profileTab);

    expect(mockDispatch).toHaveBeenCalled();
    expect(localStorage.getItem('activeTab')).toBe('profile');
  });
});
