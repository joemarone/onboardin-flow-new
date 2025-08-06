import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application header', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /Alpha Anywhere - Customer Onboarding/i });
  expect(heading).toBeInTheDocument();
});
