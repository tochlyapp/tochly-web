import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LeftSidebarMenu from 'src/layouts/auth-layout/LeftSidebarMenu';
import { changeLayoutMode, setActiveTab } from 'src/redux/slices/layout';

jest.mock('src/redux/services/authAPI', () => ({
  useLogoutMutation: jest.fn(() => [jest.fn()]),
  usePatchCurrentUserProfileMutation: jest.fn(() => [jest.fn()]),
}));

jest.mock('src/i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return key for simplicity
  }),
}));

// Mock data
const mockStore = configureStore([]);
const initialState = {
  layout: {
    layoutMode: 'light',
    activeTab: 'profile',
  },
  auth: {
    isAuthenticated: true,
  },
};

describe('LeftSidebarMenu Component', () => {
  let store: any;

  beforeAll(() => {
    // Mock window.confirm
    global.confirm = jest.fn();
  });

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterAll(() => {
    // Clean up after tests
    (global.confirm as jest.Mock).mockRestore(); // Restore original behavior if needed
  });

  const mockLogout = jest.fn(() => ({
    unwrap: jest.fn().mockResolvedValueOnce('success'),
  }));

  const mockPatchProfile = jest.fn(() => ({
    unwrap: jest.fn().mockResolvedValueOnce('success'),
  }));

  const { useLogoutMutation, usePatchCurrentUserProfileMutation } = require('src/redux/services/authAPI');
  useLogoutMutation.mockReturnValue([mockLogout]);
  usePatchCurrentUserProfileMutation.mockReturnValue([mockPatchProfile]);

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LeftSidebarMenu />
        </MemoryRouter>
      </Provider>
    );

  it('renders the sidebar with tabs', () => {
    renderComponent();

    expect(screen.getByRole('logo')).toBeInTheDocument();
    expect(screen.getByLabelText('profile')).toBeInTheDocument();
    expect(screen.getByLabelText('chat')).toBeInTheDocument();
    expect(screen.getByLabelText('group')).toBeInTheDocument();
    expect(screen.getByLabelText('contacts')).toBeInTheDocument();
    expect(screen.getByLabelText('settings')).toBeInTheDocument();
  });

  it('toggles the active tab when a tab is clicked', () => {
    renderComponent();

    const chatTab = screen.getByLabelText('chat');
    fireEvent.click(chatTab);

    expect(store.getActions()).toContainEqual(setActiveTab('chat'));
    expect(localStorage.getItem('activeTab')).toBe('chat');
  });

  it('toggles the layout mode when the theme toggle is clicked', async () => {
    renderComponent();

    const themeToggle = screen.getByLabelText('light-dark');
    await waitFor(() => (
      fireEvent.click(themeToggle)
    ));

    const expectedMode = initialState.layout.layoutMode === 'light' ? 'dark' : 'light';
    expect(store.getActions()).toContainEqual(changeLayoutMode(expectedMode));
  });

  it('changes the language when a different language is selected', () => {
    renderComponent();

    const languageDropdown = screen.getByLabelText('global-icon');
    fireEvent.click(languageDropdown);

    const spanishOption = screen.getByText('Spanish');
    fireEvent.click(spanishOption);

    const i18n = require('src/i18n');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('sp');
  });

  it('logs out when the logout button is clicked', () => {
    renderComponent();

    const profileDropdown = screen.getByAltText('user');
    fireEvent.click(profileDropdown);

    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);

    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to log out?');
  });
});
