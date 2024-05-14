import { render, screen } from '@testing-library/react';
import DeleteDeckConfirmationDialog from './DeleteDeckConfirmationDialog';
import PersistedDeck from '../types/PersistedDeck';
import userEvent, { UserEvent } from '@testing-library/user-event';

describe('Delete Deck Confirmation Dialog', () => {
  let user: UserEvent;
  let onConfirm: () => void;
  let onClose: () => void;
  let deck: PersistedDeck;
  beforeEach(() => {
    user = userEvent.setup();
    onConfirm = vi.fn();
    onClose = vi.fn();
    deck = { id: '1', name: 'Deck Name', imageUrl: '', attributes: [], cards: [] };
  });
  it('should be displayed when deck is defined', () => {
    render(<DeleteDeckConfirmationDialog deck={deck} onConfirm={onConfirm} onClose={onClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('should not be displayed when deck is undefined', () => {
    render(<DeleteDeckConfirmationDialog deck={undefined} onConfirm={onConfirm} onClose={onClose} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('should have title', () => {
    render(<DeleteDeckConfirmationDialog deck={deck} onConfirm={onConfirm} onClose={onClose} />);

    expect(screen.getByRole('dialog', { name: 'Delete deck' }));
  });
  it('should have message', () => {
    render(<DeleteDeckConfirmationDialog deck={deck} onConfirm={onConfirm} onClose={onClose} />);

    expect(screen.getByText(`Are you sure you want to delete deck '${deck.name}'?`));
  });
  it('should have cancel button', () => {
    render(<DeleteDeckConfirmationDialog deck={deck} onConfirm={onConfirm} onClose={onClose} />);

    expect(screen.getByRole('button', { name: 'Cancel' }));
  });
  it('should have confirm button', () => {
    render(<DeleteDeckConfirmationDialog deck={deck} onConfirm={onConfirm} onClose={onClose} />);

    expect(screen.getByRole('button', { name: 'Confirm' }));
  });
  it('should call onClose when cancel button is clicked', async () => {
    render(<DeleteDeckConfirmationDialog deck={deck} onConfirm={onConfirm} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalled();
  });
  it('should call onConfirm when confirm button is clicked', async () => {
    render(<DeleteDeckConfirmationDialog deck={deck} onConfirm={onConfirm} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalled();
  });
});
