import { render, screen } from '@testing-library/react';
import App from './App';

test('renders customer onboarding pipeline', () => {
  render(<App />);
  const heading = screen.getByText(/Customer Onboarding Pipeline/i);
  expect(heading).toBeInTheDocument();
});
