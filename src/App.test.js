import { render, screen } from '@testing-library/react';
import App from './App';

test('renders strategic procurement dashboard', () => {
  render(<App />);
  const linkElement = screen.getByText(/Strategic Procurement Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders executive analytics platform text', () => {
  render(<App />);
  const platformText = screen.getByText(/Executive Analytics Platform/i);
  expect(platformText).toBeInTheDocument();
});

test('renders navigation tabs', () => {
  render(<App />);
  const overviewTab = screen.getByText(/Executive Overview/i);
  const spendingTab = screen.getByText(/Spending Analysis/i);
  const vendorsTab = screen.getByText(/Vendor Management/i);
  const initiativesTab = screen.getByText(/Strategic Initiatives/i);
  const riskTab = screen.getByText(/Risk Management/i);
  
  expect(overviewTab).toBeInTheDocument();
  expect(spendingTab).toBeInTheDocument();
  expect(vendorsTab).toBeInTheDocument();
  expect(initiativesTab).toBeInTheDocument();
  expect(riskTab).toBeInTheDocument();
});