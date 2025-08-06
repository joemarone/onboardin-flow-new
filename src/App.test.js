import { render, screen } from '@testing-library/react';
import App from './App';

test('renders onboarding header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Alpha Anywhere - Customer Onboarding/i });
  expect(headerElement).toBeInTheDocument();
});
