import { useReducer, useState } from 'react';
import Deck from '../types/Deck';
import DeckEdit from './DeckEdit';
import DeckGrid from './DeckGrid';
import DeleteDeckConfirmationDialog from './DeleteDeckConfirmationDialog';
import DeckAdminReducer from './DeckAdminReducer';
import useDeck from '../hooks/useDeck';
import { Snackbar } from '@mui/material';

export default function DeckAdmin() {
  const [state, dispatch] = useReducer(DeckAdminReducer, {});
  const { decks, updateDeck, saveDeck, deleteDeck } = useDeck();
  const [error, setError] = useState<string>();

  const onUpdateConfirm = async (updatedDeck: Deck) => {
    if (state.editDeck) {
      dispatch({ type: 'DECK_UPDATED' });
      try {
        await updateDeck({ ...updatedDeck, id: state.editDeck.id });
      } catch {
        setError('Failed to update deck');
      }
    } else {
      dispatch({ type: 'DECK_CREATED' });
      try {
        await saveDeck(updatedDeck);
      } catch {
        setError('Failed to save deck');
      }
    }
  };
  const onDeleteConfirm = async () => {
    if (state.deleteDeck) {
      dispatch({ type: 'DECK_DELETED' });
      try {
        await deleteDeck(state.deleteDeck);
      } catch {
        setError('Failed to delete deck');
      }
    }
  };

  const editDeck = state.newDeck || state.editDeck;

  return editDeck ? (
    <DeckEdit
      deck={editDeck}
      onConfirm={onUpdateConfirm}
      onCancel={() => dispatch({ type: 'EDIT_DECK_CANCELLED' })}
      confirmText={state.newDeck ? 'Save' : 'Update'}
    />
  ) : (
    <>
      <DeckGrid
        decks={decks}
        onDeckEdit={(value) => dispatch({ type: 'EDIT_DECK', deck: value })}
        onDeckAdd={() => dispatch({ type: 'NEW_DECK' })}
        onDeckDelete={(value) => dispatch({ type: 'DELETE_DECK', deck: value })}
      />
      <DeleteDeckConfirmationDialog deck={state.deleteDeck} onConfirm={onDeleteConfirm} onClose={() => dispatch({ type: 'DELETE_DECK_CANCELLED' })} />
      <Snackbar
        open={!!error}
        onClose={() => setError(undefined)}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={2000}
      />
    </>
  );
}
