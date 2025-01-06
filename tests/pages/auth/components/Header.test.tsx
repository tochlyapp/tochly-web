import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from 'src/pages/auth/components/Header';

describe('Header Component', () => {
  it('renders the title and description correctly', () => {
    const { getByText } = render(
      <Router>
        <Header title="Test Title" description="Test Description" />
      </Router>
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  it('renders the link to the homepage', () => {
    const { getByRole } = render(
      <Router>
        <Header title="Test Title" description="Test Description" />
      </Router>
    );

    const link = getByRole('link', { name: /logo/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
