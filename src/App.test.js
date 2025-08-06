import { render, screen } from '@testing-library/react';
import App from './App';

test('renders onboarding heading', () => {
  render(<App />);
  const heading = screen.getByText(/Onboarding Flow/i);
  expect(heading).toBeInTheDocument();
});
