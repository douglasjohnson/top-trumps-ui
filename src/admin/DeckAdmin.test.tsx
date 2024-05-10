import { findAll } from '../service/DeckService';
import DeckAdmin from './DeckAdmin';
import { render, screen } from '@testing-library/react';
import PersistedDeck from '../types/PersistedDeck';

vitest.mock('../service/DeckService');

const mockedFindAll = vitest.mocked(findAll);

describe('Deck Admin', () => {
  it('should load decks', () => {
    mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

    render(<DeckAdmin />);

    expect(findAll).toHaveBeenCalled();
  });
  it('should display decks on load success', () => {
    const decks: PersistedDeck[] = [{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }];
    mockedFindAll.mockResolvedValueOnce(decks);

    render(<DeckAdmin />);

    expect(screen.getByText('Deck 1')).toBeInTheDocument();
  });
});
