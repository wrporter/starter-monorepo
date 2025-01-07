import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';

import Component from './index.js';

const RoutesStub = createRoutesStub([
  {
    path: '/',
    Component,
  },
]);

it('renders the welcome page', () => {
  render(<RoutesStub />);

  expect(screen.getByRole('heading', { name: /Welcome/ })).toBeInTheDocument();
});
