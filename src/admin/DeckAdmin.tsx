import { useEffect, useReducer } from 'react';
import Deck from '../types/Deck';
import DeckEdit from './DeckEdit';
import DeckGrid from './DeckGrid';
import DeleteDeckConfirmationDialog from './DeleteDeckConfirmationDialog';
import DeckAdminReducer from './DeckAdminReducer';
import { deleteDeck, findAll, save, update } from '../service/DeckService';

export default function DeckAdmin() {
  const [state, dispatch] = useReducer(DeckAdminReducer, {});

  const onUpdateConfirm = (updatedDeck: Deck) => {
    if (state.editDeck) {
      update({ ...updatedDeck, id: state.editDeck.id }).then((deck) => dispatch({ type: 'DECK_UPDATED', deck }));
    } else {
      save(updatedDeck).then((deck) => dispatch({ type: 'DECK_CREATED', deck }));
    }
  };

  const onDeleteConfirm = () => state.deleteDeck && deleteDeck(state.deleteDeck).then((deck) => dispatch({ type: 'DECK_DELETED', deck }));

  useEffect(() => {
    findAll()
      .then((decks) => dispatch({ type: 'DECKS_LOAD_SUCCESS', decks }))
      .catch((error) => console.log(error));
  }, []);

  const editDeck = state.newDeck || state.editDeck;

  return editDeck ? (
    <DeckEdit
      deck={editDeck}
      onConfirm={onUpdateConfirm}
      onCancel={() => dispatch({ type: 'EDIT_DECK_CANCELLED' })}
      confirmText={state.newDeck ? 'Save' : 'Update'}
    />
  ) : (
    state.decks && (
      <>
        <DeckGrid
          decks={state.decks}
          onDeckEdit={(value) => dispatch({ type: 'EDIT_DECK', deck: value })}
          onDeckAdd={() => dispatch({ type: 'NEW_DECK' })}
          onDeckDelete={(value) => dispatch({ type: 'DELETE_DECK', deck: value })}
        />
        <DeleteDeckConfirmationDialog
          deck={state.deleteDeck}
          onConfirm={onDeleteConfirm}
          onClose={() => dispatch({ type: 'DELETE_DECK_CANCELLED' })}
        />
      </>
    )
  );
}
