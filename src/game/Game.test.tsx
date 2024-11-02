import { render, screen } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import Game from './Game';
import { findAll } from '../service/DeckService';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import { afterEach, vitest } from 'vitest';

vi.mock('../service/DeckService');

const mockedFindAll = vi.mocked(findAll);

const Wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <Suspense>{children}</Suspense>
  </SWRConfig>
);

describe('Game', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {
    vitest.resetAllMocks();
  });
  it('should load decks', () => {
    mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

    render(<Game />, { wrapper: Wrapper });

    expect(mockedFindAll).toHaveBeenCalled();
  });
  it('should display decks on load success', async () => {
    mockedFindAll.mockResolvedValueOnce([{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }]);

    render(<Game />, { wrapper: Wrapper });

    expect(await screen.findByText('Deck 1')).toBeInTheDocument();
  });
  it('should start game on deck selection', async () => {
    mockedFindAll.mockResolvedValueOnce([{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }]);

    render(<Game />, { wrapper: Wrapper });
    await user.click(await screen.findByText('Deck 1'));

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });
});
