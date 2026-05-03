import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';

// Mock the next/font/google module
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-class',
  }),
}));

describe('Home Component', () => {
  it('renders the heading', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', {
      name: /Job Matcher/i,
    });
    
    expect(heading).toBeInTheDocument();
  });

  it('renders input fields for job link and resume upload', () => {
    render(<Home />);
    
    const jobLinkInput = screen.getByLabelText(/Job Description URL or Text/i);
    const fileInput = screen.getByLabelText(/Upload Resume \(PDF\)/i);
    
    expect(jobLinkInput).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
  });

  it('shows error if submitting empty form', () => {
    render(<Home />);
    
    const submitButton = screen.getByRole('button', { name: /Tailor My Resume/i });
    fireEvent.click(submitButton);
    
    const errorMessage = screen.getByText(/Please provide a Job Link\/Description and upload a PDF Resume/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
