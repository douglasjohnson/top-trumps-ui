import { findAll } from '../service/DeckService';
import DeckAdmin from './DeckAdmin';
import { render, screen } from '@testing-library/react';
import PersistedDeck from '../types/PersistedDeck';
import userEvent, { UserEvent } from '@testing-library/user-event';

vitest.mock('../service/DeckService');

const mockedFindAll = vitest.mocked(findAll);

describe('Deck Admin', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('should load decks', () => {
    mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

    render(<DeckAdmin />);

    expect(findAll).toHaveBeenCalled();
  });
  it('should display decks on load success', async () => {
    const decks: PersistedDeck[] = [{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }];
    mockedFindAll.mockResolvedValueOnce(decks);

    render(<DeckAdmin />);

    expect(await screen.findByText('Deck 1')).toBeInTheDocument();
  });
  describe('edit', () => {
    it('should show edit deck on deck click', async () => {
      const decks: PersistedDeck[] = [{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }];
      mockedFindAll.mockResolvedValueOnce(decks);
      render(<DeckAdmin />);

      await user.click(await screen.findByRole('button', { name: 'edit' }));

      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Deck 1');
    });
    it('should show all decks on cancel', async () => {
      const decks: PersistedDeck[] = [{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }];
      mockedFindAll.mockResolvedValueOnce(decks);
      render(<DeckAdmin />);
      await user.click(await screen.findByRole('button', { name: 'edit' }));

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Deck 1')).toBeInTheDocument();
    });
  });
  describe('create', () => {
    it('should show new deck on create click', async () => {
      const decks: PersistedDeck[] = [{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }];
      mockedFindAll.mockResolvedValueOnce(decks);
      render(<DeckAdmin />);

      await user.click(await screen.findByRole('button', { name: 'create' }));

      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    });
    it('should show all decks on cancel', async () => {
      const decks: PersistedDeck[] = [{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }];
      mockedFindAll.mockResolvedValueOnce(decks);
      render(<DeckAdmin />);
      await user.click(await screen.findByRole('button', { name: 'create' }));

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Deck 1')).toBeInTheDocument();
    });
  });
});
