import { render, screen, within } from '@testing-library/react';
import App from './App';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { findAll } from './service/DeckService';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('./service/DeckService');

const mockedFindAll = vi.mocked(findAll);

const navigation = () => screen.getByRole('navigation');
const main = () => screen.getByRole('main');

describe('App', () => {
  let user: UserEvent;
  let queryClient: QueryClient;
  beforeEach(() => {
    user = userEvent.setup();
    queryClient = new QueryClient();
    mockedFindAll.mockResolvedValue([{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }]);
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  });
  describe('navigation', () => {
    it('should have navigation', () => {
      expect(navigation()).toBeInTheDocument();
    });
    it('should have home button', () => {
      expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    });
    it('should have build button', () => {
      expect(screen.getByRole('button', { name: 'Build' })).toBeInTheDocument();
    });
    it('should have play button', () => {
      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });
    it('should navigate to build when build button is clicked', async () => {
      await user.click(within(navigation()).getByRole('button', { name: 'Build' }));

      expect(screen.getByRole('heading', { name: 'Build' })).toBeInTheDocument();
      expect(await screen.findByText('Deck 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
    });
    it('should show loading indicator when build is loading', async () => {
      mockedFindAll.mockClear();
      mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

      await user.click(within(navigation()).getByRole('button', { name: 'Build' }));

      expect(screen.getByRole('heading', { name: 'Build' })).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    it('should navigate to play when play button is clicked', async () => {
      await user.click(within(navigation()).getByRole('button', { name: 'Play' }));

      expect(screen.getByRole('heading', { name: 'Play' })).toBeInTheDocument();
      expect(await screen.findByText('Deck 1')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument();
    });
    it('should show loading indicator when play is loading', async () => {
      mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

      await user.click(within(navigation()).getByRole('button', { name: 'Play' }));

      expect(screen.getByRole('heading', { name: 'Play' })).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
  describe('home', () => {
    it('should default to home', () => {
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    });
    it('should have link for build', () => {
      expect(within(main()).getByRole('link', { name: 'build' })).toBeInTheDocument();
    });
    it('should have link for play', () => {
      expect(within(main()).getByRole('link', { name: 'play' })).toBeInTheDocument();
    });
    it('should navigate to build when build link is clicked', async () => {
      await user.click(within(main()).getByRole('link', { name: 'build' }));

      expect(screen.getByRole('heading', { name: 'Build' })).toBeInTheDocument();
      expect(await screen.findByText('Deck 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
    });
    it('should navigate to play when play link is clicked', async () => {
      await user.click(within(main()).getByRole('link', { name: 'play' }));

      expect(screen.getByRole('heading', { name: 'Play' })).toBeInTheDocument();
      expect(await screen.findByText('Deck 1')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument();
    });
  });
});
