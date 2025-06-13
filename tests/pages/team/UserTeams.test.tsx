import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UserTeams from 'src/pages/team/UserTeams';
import { useGetUserTeamsQuery } from 'src/redux/services/team';
import { useGetCurrentUserQuery } from 'src/redux/services/auth';

// Mock RTK Query hooks
jest.mock('src/redux/services/team', () => ({
  useGetUserTeamsQuery: jest.fn(),
}));
jest.mock('src/redux/services/auth', () => ({
  useGetCurrentUserQuery: jest.fn(),
}));

describe('UserTeams Component', () => {
  const mockStore = configureStore([]);
  const initialState = { auth: { isAuthenticated: false } };
  const store = mockStore(initialState);

  const renderComponent = () => (
    render(
      <Provider store={store}>
        <Router>
          <UserTeams />
        </Router>
      </Provider>
    )
  );
  it('renders loading spinner when data is loading', () => {
    (useGetUserTeamsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    (useGetCurrentUserQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderComponent();

    expect(screen.getByLabelText('loading')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner has "role=status"
  });

  it('renders error message when fetching data fails', () => {
    (useGetUserTeamsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    (useGetCurrentUserQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderComponent();

    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
  });

  it('renders "No teams found" message when userTeams is empty', () => {
    (useGetUserTeamsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    (useGetCurrentUserQuery as jest.Mock).mockReturnValue({
      data: { email: 'test@example.com' },
      isLoading: false,
      isError: false,
    });

    renderComponent();

    expect(screen.getByText('No teams found.')).toBeInTheDocument();
  });

  it('renders teams and user email when data is available', async () => {
    const mockTeams = [
      { id: '1', name: 'Team A', tid: 'team-a' },
      { id: '2', name: 'Team B', tid: 'team-b' },
    ];

    (useGetUserTeamsQuery as jest.Mock).mockReturnValue({
      data: mockTeams,
      isLoading: false,
      isError: false,
    });
    (useGetCurrentUserQuery as jest.Mock).mockReturnValue({
      data: { email: 'user@example.com' },
      isLoading: false,
      isError: false,
    });

    renderComponent();

    mockTeams.forEach((team) => {
      expect(screen.getByText(team.name)).toBeInTheDocument();
      expect(screen.getByLabelText('team-link-team-a')).toHaveAttribute(
        'href',
        '/teams/team-a'
      );
      expect(screen.getByLabelText('team-link-team-b')).toHaveAttribute(
        'href',
        '/teams/team-b'
      );
    });
  });

  it('renders "Unknown User" if current user email is unavailable', () => {
    (useGetUserTeamsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    (useGetCurrentUserQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    renderComponent();
  });
});
