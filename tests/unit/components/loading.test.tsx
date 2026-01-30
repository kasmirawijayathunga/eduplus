import { render, screen } from '@testing-library/react';
import Loading from '@/components/Loading';

describe('Loading Component', () => {
  it('renders the loading text', () => {
    render(<Loading />);
    const loadingText = screen.getByText(/Loading.../i);
    expect(loadingText).toBeInTheDocument();
  });
});
