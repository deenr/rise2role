import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('render', () => {
  it('renders the main page', () => {
    const { getByText } = render(<App />);
    expect(getByText('Test')).toBeInTheDocument();
  });
});
