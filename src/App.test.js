import { render, screen } from '@testing-library/react';
import App from './App';

test('renders customer onboarding pipeline', () => {
  render(<App />);
  const headerElement = screen.getByText(/customer onboarding pipeline/i);
  expect(headerElement).toBeInTheDocument();
});
