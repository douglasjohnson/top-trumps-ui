import { useReducer } from 'react';
import Deck from '../types/Deck';
import DeckEdit from './DeckEdit';
import DeckGrid from './DeckGrid';
import DeleteDeckConfirmationDialog from './DeleteDeckConfirmationDialog';
import DeckAdminReducer from './DeckAdminReducer';
import { deleteDeck, save, update } from '../service/DeckService';
import useDeck from '../hooks/useDeck';
import useSWRMutation from 'swr/mutation';
import PersistedDeck from '../types/PersistedDeck';

export default function DeckAdmin() {
  const [state, dispatch] = useReducer(DeckAdminReducer, {});
  const { decks } = useDeck();

  const { trigger: deckUpdateMutation } = useSWRMutation('decks', (_key, { arg }: { arg: PersistedDeck }) => update(arg));
  const { trigger: deckSaveMutation } = useSWRMutation('decks', (_key, { arg }: { arg: Deck }) => save(arg));
  const { trigger: deckDeleteMutation } = useSWRMutation('decks', (_key, { arg }: { arg: PersistedDeck }) => deleteDeck(arg));

  const onUpdateConfirm = async (updatedDeck: Deck) => {
    if (state.editDeck) {
      const deckToUpdate = updatedDeck as PersistedDeck;
      dispatch({ type: 'DECK_UPDATED' });
      await deckUpdateMutation(
        { ...updatedDeck, id: state.editDeck.id },
        {
          optimisticData: decks.map((existingDeck) => (deckToUpdate.id === existingDeck.id ? deckToUpdate : existingDeck)),
          revalidate: true,
        },
      );
    } else {
      dispatch({ type: 'DECK_CREATED' });
      await deckSaveMutation(updatedDeck, {
        optimisticData: [...decks, { ...updatedDeck, id: '' }],
        revalidate: true,
      });
    }
  };
  const onDeleteConfirm = async () => {
    if (state.deleteDeck) {
      dispatch({ type: 'DECK_DELETED' });
      await deckDeleteMutation(state.deleteDeck, {
        optimisticData: () => decks.filter((existingDeck) => existingDeck !== state.deleteDeck),
        revalidate: true,
      });
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
    </>
  );
}
