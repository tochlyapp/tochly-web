import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import NavItemWithTooltip from 'src/components/NavItemWithTooltip';

describe('NavItemWithTooltip Component', () => {
  const props = {
    id: 'test-id',
    iconClassName: 'ri-home-line',
    tooltip: 'Home',
    onClick: jest.fn(),
    'aria-label': 'Go to home',
  };

  it('renders the component correctly', () => {
    render(<NavItemWithTooltip {...props} />);
    
    const navItem = screen.getByLabelText('Go to home');
    expect(navItem).toBeInTheDocument();
    expect(navItem.tagName).toBe('A'); // Ensure it's a link
  });

  it('calls onClick handler when clicked', () => {
    render(<NavItemWithTooltip {...props} />);

    const navLink = screen.getByLabelText('Go to home');
    fireEvent.click(navLink);

    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
