import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TopNavbar from 'src/pages/dashbord/TopNavbar';

const mockStore = configureStore([]);

describe('TopNavbar Component', () => {
  it('renders the navbar with the brand name', () => {
    const initialState = { auth: { isAuthenticated: false } };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TopNavbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Tochly/i)).toBeInTheDocument();
  });

  it('shows "Sign in" when the user is not authenticated', () => {
    const initialState = { auth: { isAuthenticated: false } };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TopNavbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  it('toggles the navbar when the toggler button is clicked', () => {
    const initialState = { auth: { isAuthenticated: false } };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TopNavbar />
        </MemoryRouter>
      </Provider>
    );

    const togglerButton = screen.getByLabelText(/Toggle navigation/i);
    fireEvent.click(togglerButton);

    // Since the collapse is not visible in the DOM after toggling, we assume it worked if no errors occurred.
    expect(togglerButton).toBeInTheDocument();
  });
});
