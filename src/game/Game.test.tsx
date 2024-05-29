import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import Game from './Game';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { findAll } from '../service/DeckService';
import userEvent, { UserEvent } from '@testing-library/user-event';

vi.mock('../service/DeckService');

const mockedFindAll = vi.mocked(findAll);

describe('Game', () => {
  let user: UserEvent;
  let queryClient: QueryClient;
  beforeEach(() => {
    user = userEvent.setup();
    queryClient = new QueryClient();
  });
  it('should load decks', () => {
    mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <Game />
        </Suspense>
      </QueryClientProvider>,
    );

    expect(mockedFindAll).toHaveBeenCalled();
  });
  it('should display decks on load success', async () => {
    mockedFindAll.mockResolvedValueOnce([{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }]);

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <Game />
        </Suspense>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Deck 1')).toBeInTheDocument();
  });
  it('should start game on deck selection', async () => {
    mockedFindAll.mockResolvedValueOnce([{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }]);

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <Game />
        </Suspense>
      </QueryClientProvider>,
    );
    await user.click(await screen.findByText('Deck 1'));

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });
});
