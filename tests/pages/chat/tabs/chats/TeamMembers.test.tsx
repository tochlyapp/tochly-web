import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TeamMembers from 'src/pages/chat/tabs/chats/TeamMembers';
import { useSocket } from 'src/context/hooks';
import { startChat } from 'src/lib/socket';
import { TeamMember } from 'src/types';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('src/context/hooks', () => ({
  useSocket: jest.fn(),
}));

jest.mock('src/lib/socket', () => ({
  startChat: jest.fn(),
}));

jest.mock('react-alice-carousel', () => {
  const originalModule = jest.requireActual('react-alice-carousel');
  return {
    ...originalModule,
    __esModule: true,
    default: jest.fn(({ children }) => <div data-testid="carousel">{children}</div>),
  };
});

describe('TeamMembers Component', () => {
  const mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      user: { 
        id: 101, 
        email: 'user1@example.com',
        first_name: 'John',
        last_name: 'Doe',
        timezone: 'utc',
      },
      profile: {
        id: 100,
        user: 10,
        email: 'johndoe@example.com',
        full_name: "John Doe",
        dark_mode: true,
      },
      full_name: 'John Doe',
      display_name: 'John',
      role: 'admin',
      title: 'Team Lead',
      phone_number: '+1234567890',
      online: true,
      status: 'active',
    },
    {
      id: 2,
      user: { 
        id: 102, 
        email: 'user2@example.com',
        first_name: 'Dane',
        last_name: 'Smith',
        timezone: 'utc',
      },
      profile: {
        id: 100,
        user: 10,
        email: 'johndoe@example.com',
        full_name: 'Dane Smith',
        dark_mode: true,
      },
      full_name: 'Dane Smith',
      display_name: 'Dane',
      role: 'member',
      title: 'Developer',
      phone_number: '+9876543210',
      online: false,
      status: 'away',
    },
  ];

  const mockSetSearch = jest.fn();
  const mockSocket = {
    connected: true,
  };

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ tid: 'team123' });
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    (startChat as jest.Mock).mockClear();
    mockSetSearch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  test('renders correctly with team members including all type properties', () => {
    render(<TeamMembers teamMembers={mockTeamMembers} setSearch={mockSetSearch} />);

    // Check carousel and basic rendering
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Dane Smith')).toBeInTheDocument();

    // Check online status
    const onlineIndicators = screen.queryAllByLabelText('status');
    expect(onlineIndicators[0]).toHaveClass('online');
    expect(onlineIndicators[1]).not.toHaveClass('online');

    // Check avatar initials
    expect(screen.getByText('J')).toBeInTheDocument(); // John
    expect(screen.getByText('D')).toBeInTheDocument(); // Dane
  });

  test('handles click with complete team member data', () => {
    render(<TeamMembers teamMembers={mockTeamMembers} setSearch={mockSetSearch} />);
    
    fireEvent.click(screen.getByText('John Doe'));
    
    expect(startChat).toHaveBeenCalledWith(mockSocket, {
      team_id: 'team123',
      receiver_id: '101', // String conversion happens in the component
    });
    
    expect(mockSetSearch).toHaveBeenCalledWith('');
  });

  test('handles team member without optional fields', () => {
    const minimalTeamMember: TeamMember = {
      id: 3,
      user: { 
        id: 103, 
        email: 'minimal@example.com',
        first_name: 'Minimal',
        last_name: 'User',
        timezone: 'utc',
      },
      profile: {
        id: 100,
        user: 10,
        email: 'minimal@example.com',
        full_name: 'Minimal User',
        dark_mode: true,
      },
      role: 'member',
      full_name: 'Minimal User',
      display_name: 'Minimal',
      online: false,
    };

    render(<TeamMembers teamMembers={[minimalTeamMember]} setSearch={mockSetSearch} />);
    
    expect(screen.getByText('Minimal User')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Minimal User'));
    
    expect(startChat).toHaveBeenCalledWith(mockSocket, {
      team_id: 'team123',
      receiver_id: '103',
    });
  });

  test('handles profile picture if available', () => {
    // This would require mocking the img rendering in your component
    // Currently your component shows initials only
    // You might want to add this test if you implement profile pictures later
  });

  test('displays different roles correctly', () => {
    // You could extend this to test role-specific rendering if your component shows roles
  });
});
