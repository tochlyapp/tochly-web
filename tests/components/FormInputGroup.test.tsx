import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import FormInputGroup from 'src/components/FormInputGroup';

const getProps = (overrides = {}) => ({
  fieldName: 'username',
  label: 'Username',
  type: 'text',
  value: '',
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ...overrides,
});

describe('FormInputGroup Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with required props', () => {
    render(<FormInputGroup {...getProps()} />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toHaveAttribute('type', 'text');
  });

  it('renders a textarea when textArea prop is true', () => {
    render(<FormInputGroup {...getProps({ type: 'textarea', textAreaRowNumber: 5 })} />);

    const textarea = screen.getByLabelText('Username');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('displays validation error when invalid prop is true', () => {
    render(<FormInputGroup {...getProps({ invalid: true, inputError: 'This field is required.' })} />);

    expect(screen.getByText('This field is required.')).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', () => {
    const mockOnChange = jest.fn();
    render(<FormInputGroup {...getProps({ onChange: mockOnChange })} />);

    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls onBlur handler when input loses focus', () => {
    const mockOnBlur = jest.fn();
    render(<FormInputGroup {...getProps({ onBlur: mockOnBlur })} />);

    const input = screen.getByLabelText('Username');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
    expect(mockOnBlur).toHaveBeenCalledWith(expect.any(Object));
  });

  it('renders input icon when classNameInputIcon is provided', () => {
    render(<FormInputGroup {...getProps({ classNameInputIcon: 'ri-user-line' })} />);

    const icon = screen.getByRole('icon', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('ri-user-line');
  });

  it('renders with default props when optional props are not provided', () => {
    render(<FormInputGroup {...getProps()} />);

    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', '');
  });
});
