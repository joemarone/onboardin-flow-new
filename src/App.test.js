import { render, screen } from '@testing-library/react';
import App from './App';

test('renders customer table', () => {
  render(<App />);
  const heading = screen.getByText(/Customers/i);
  expect(heading).toBeInTheDocument();
});
