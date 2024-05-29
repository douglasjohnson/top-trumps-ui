import { useReducer } from 'react';
import Deck from '../types/Deck';
import DeckEdit from './DeckEdit';
import DeckGrid from './DeckGrid';
import DeleteDeckConfirmationDialog from './DeleteDeckConfirmationDialog';
import DeckAdminReducer from './DeckAdminReducer';
import { deleteDeck, findAll, save, update } from '../service/DeckService';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export default function DeckAdmin() {
  const [state, dispatch] = useReducer(DeckAdminReducer, {});
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ['decks'], queryFn: findAll });

  const deckUpdateMutation = useMutation({
    mutationFn: update,
    onSuccess: (deck) => {
      dispatch({ type: 'DECK_UPDATED', deck });
      queryClient.setQueryData(
        ['decks'],
        data.map((existingDeck) => (deck.id === existingDeck.id ? deck : existingDeck)),
      );
    },
  });
  const deckSaveMutation = useMutation({
    mutationFn: save,
    onSuccess: (deck) => {
      dispatch({ type: 'DECK_CREATED', deck });
      queryClient.setQueryData(['decks'], [...data, deck]);
    },
  });
  const deckDeleteMutation = useMutation({
    mutationFn: deleteDeck,
    onSuccess: (deck) => {
      dispatch({ type: 'DECK_DELETED', deck });
      queryClient.setQueryData(
        ['decks'],
        data.filter((existingDeck) => existingDeck !== deck),
      );
    },
  });

  const onUpdateConfirm = (updatedDeck: Deck) => {
    if (state.editDeck) {
      deckUpdateMutation.mutate({ ...updatedDeck, id: state.editDeck.id });
    } else {
      deckSaveMutation.mutate(updatedDeck);
    }
  };
  const onDeleteConfirm = () => state.deleteDeck && deckDeleteMutation.mutate(state.deleteDeck);

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
        decks={data}
        onDeckEdit={(value) => dispatch({ type: 'EDIT_DECK', deck: value })}
        onDeckAdd={() => dispatch({ type: 'NEW_DECK' })}
        onDeckDelete={(value) => dispatch({ type: 'DELETE_DECK', deck: value })}
      />
      <DeleteDeckConfirmationDialog deck={state.deleteDeck} onConfirm={onDeleteConfirm} onClose={() => dispatch({ type: 'DELETE_DECK_CANCELLED' })} />
    </>
  );
}
