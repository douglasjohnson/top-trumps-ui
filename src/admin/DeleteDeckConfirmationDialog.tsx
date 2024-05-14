import ConfirmationDialog from './ConfirmationDialog';
import PersistedDeck from '../types/PersistedDeck';

interface DeleteDeckConfirmationDialogProps {
  deck?: PersistedDeck;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteDeckConfirmationDialog({ deck, onConfirm, onClose }: DeleteDeckConfirmationDialogProps) {
  return (
    deck && (
      <ConfirmationDialog
        open
        title="Delete deck"
        text={`Are you sure you want to delete deck '${deck.name}'?`}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    )
  );
}
