import { deleteDeck, findAll, save, update } from '../service/DeckService';
import DeckAdmin from './DeckAdmin';
import { act, render, screen, within } from '@testing-library/react';
import PersistedDeck from '../types/PersistedDeck';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ReactNode, Suspense } from 'react';
import { SWRConfig } from 'swr';
import { vitest } from 'vitest';

vitest.mock('../service/DeckService');

const mockedFindAll = vitest.mocked(findAll);

const deckCard = (name: string) => screen.getByText(name).closest('.MuiCard-root') as HTMLElement;
const deleteConfirmationDialog = () => screen.getByRole('dialog', { name: 'Delete deck' });

const Wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <Suspense>{children}</Suspense>
  </SWRConfig>
);

describe('Deck Admin', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
    vitest.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vitest.resetAllMocks();
    vitest.useRealTimers();
  });
  it('should load decks', () => {
    mockedFindAll.mockImplementation(() => new Promise(vi.fn()));

    render(<DeckAdmin />, { wrapper: Wrapper });

    expect(findAll).toHaveBeenCalled();
  });
  it('should display decks on load success', async () => {
    mockedFindAll.mockResolvedValueOnce([{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }]);

    render(<DeckAdmin />, { wrapper: Wrapper });

    expect(await screen.findByText('Deck 1')).toBeInTheDocument();
  });
  describe('edit', () => {
    let deck: PersistedDeck;
    const mockedUpdate = vitest.mocked(update);
    beforeEach(async () => {
      deck = { id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] };
      const decks: PersistedDeck[] = [deck, { id: '2', name: 'Deck 2', imageUrl: '', attributes: [], cards: [] }];
      mockedFindAll.mockResolvedValueOnce(decks);
      mockedUpdate.mockImplementation(() => new Promise(vi.fn()));
      render(<DeckAdmin />, { wrapper: Wrapper });
      await screen.findByText('Deck 1');
    });
    it('should show edit deck on deck click', async () => {
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'edit' }));

      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Deck 1');
    });
    it('should show all decks on cancel', async () => {
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'edit' }));

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Deck 1')).toBeInTheDocument();
    });
    it('should update deck on confirm', async () => {
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'edit' }));

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Deck');
      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(mockedUpdate).toHaveBeenCalledWith({ ...deck, name: 'Updated Deck' });
    });
    it('should update decks on update success', async () => {
      mockedUpdate.mockResolvedValue({ ...deck, name: 'Updated Deck' });
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'edit' }));

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Deck');
      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(screen.getByText('Updated Deck')).toBeInTheDocument();
      expect(screen.getByText('Deck 2')).toBeInTheDocument();
    });
    it('should rollback on error', async () => {
      mockedUpdate.mockRejectedValue({});
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'edit' }));

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Deck');
      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(screen.queryByText('Updated Deck')).not.toBeInTheDocument();
    });
    it('should show toast on error', async () => {
      mockedUpdate.mockRejectedValue({});
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'edit' }));

      const nameInput = screen.getByRole('textbox', { name: 'Name' });
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Deck');
      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(within(screen.getByRole('alert')).getByText('Failed to update deck')).toBeInTheDocument();
    });
  });
  describe('create', () => {
    const mockedSave = vitest.mocked(save);
    beforeEach(async () => {
      const decks: PersistedDeck[] = [{ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] }];
      mockedFindAll.mockResolvedValueOnce(decks);
      mockedSave.mockImplementation(() => new Promise(vi.fn()));
      render(<DeckAdmin />, { wrapper: Wrapper });
      await screen.findByText('Deck 1');
    });
    it('should show new deck on new click', async () => {
      await user.click(screen.getByRole('button', { name: 'new' }));

      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    });
    it('should show all decks on cancel', async () => {
      await user.click(screen.getByRole('button', { name: 'new' }));

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Deck 1')).toBeInTheDocument();
    });
    it('should save deck on confirm', async () => {
      await user.click(screen.getByRole('button', { name: 'new' }));

      await user.type(screen.getByRole('textbox', { name: 'Name' }), 'New Deck');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(mockedSave).toHaveBeenCalledWith({ name: 'New Deck', imageUrl: '', attributes: [], cards: [] });
    });
    it('should update decks on save success', async () => {
      mockedSave.mockResolvedValue({ id: '2', name: 'New Deck', imageUrl: '', attributes: [], cards: [] });
      await user.click(screen.getByRole('button', { name: 'new' }));

      await user.type(screen.getByRole('textbox', { name: 'Name' }), 'New Deck');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByText('New Deck')).toBeInTheDocument();
    });
    it('should rollback on error', async () => {
      mockedSave.mockRejectedValue({});
      await user.click(screen.getByRole('button', { name: 'new' }));

      await user.type(screen.getByRole('textbox', { name: 'Name' }), 'New Deck');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.queryByText('New Deck')).not.toBeInTheDocument();
    });
    it('should show toast on error', async () => {
      mockedFindAll.mockRejectedValue({});
      mockedSave.mockRejectedValue({});
      await user.click(screen.getByRole('button', { name: 'new' }));

      await user.type(screen.getByRole('textbox', { name: 'Name' }), 'New Deck');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(within(screen.getByRole('alert')).getByText('Failed to save deck')).toBeInTheDocument();
    });
  });
  describe('delete', () => {
    const mockedDelete = vitest.mocked(deleteDeck);
    let deck: PersistedDeck;
    beforeEach(async () => {
      mockedDelete.mockImplementation(() => new Promise(vi.fn()));
      deck = { id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] };
      mockedFindAll.mockResolvedValueOnce([deck]);
      render(<DeckAdmin />, { wrapper: Wrapper });
      await screen.findByText('Deck 1');
    });
    it('should have delete deck button', () => {
      expect(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' })).toBeInTheDocument();
    });
    it('should show confirmation dialog on delete click', async () => {
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));

      expect(deleteConfirmationDialog()).toBeInTheDocument();
    });
    it('should hide delete confirmation dialog on cancel', async () => {
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));

      await user.click(within(deleteConfirmationDialog()).getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('dialog', { name: 'Delete deck' })).not.toBeInTheDocument();
    });
    it('should delete deck on confirm', async () => {
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));

      await user.click(within(deleteConfirmationDialog()).getByRole('button', { name: 'Confirm' }));

      expect(mockedDelete).toHaveBeenCalledWith({ id: '1', name: 'Deck 1', imageUrl: '', attributes: [], cards: [] });
    });
    it('should remove deck on confirm', async () => {
      mockedDelete.mockResolvedValue(deck);
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));

      await user.click(within(deleteConfirmationDialog()).getByRole('button', { name: 'Confirm' }));

      expect(screen.queryByText('Deck 1')).not.toBeInTheDocument();
    });
    it('should hide delete confirmation dialog on confirm', async () => {
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));

      const dialog = deleteConfirmationDialog();
      await user.click(within(dialog).getByRole('button', { name: 'Confirm' }));

      expect(screen.queryByRole('dialog', { name: 'Delete deck' })).not.toBeInTheDocument();
    });
    it('should rollback on error', async () => {
      mockedDelete.mockRejectedValue({});
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));

      await user.click(within(deleteConfirmationDialog()).getByRole('button', { name: 'Confirm' }));

      expect(screen.getByText('Deck 1')).toBeInTheDocument();
    });
    it('should show toast on error', async () => {
      mockedDelete.mockRejectedValue({});
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));

      await user.click(within(deleteConfirmationDialog()).getByRole('button', { name: 'Confirm' }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(within(screen.getByRole('alert')).getByText('Failed to delete deck')).toBeInTheDocument();
    });
    it('should auto hide error toast', async () => {
      mockedDelete.mockRejectedValue({});
      await user.click(within(deckCard('Deck 1')).getByRole('button', { name: 'delete' }));
      await user.click(within(deleteConfirmationDialog()).getByRole('button', { name: 'Confirm' }));

      await act(async () => {
        vitest.advanceTimersByTime(2000);
      });

      expect(screen.queryByRole('alert')).not.toBeVisible();
    });
  });
});
