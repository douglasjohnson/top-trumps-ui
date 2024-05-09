import { useEffect, useState } from 'react';
import Deck from '../types/Deck';
import DeckEdit from './DeckEdit';
import PersistedDeck from '../types/PersistedDeck';
import DeckGrid from './DeckGrid';
import { ConfirmationDialog } from './ConfirmationDialog';
import Http from '../service/Http';

function DeckAdmin() {
  const [decks, setDecks] = useState<PersistedDeck[]>();
  const [editDeck, setEditDeck] = useState<PersistedDeck>();
  const [newDeck, setNewDeck] = useState<Deck>();
  const [deleteDeck, setDeleteDeck] = useState<PersistedDeck>();

  const onDeckAdd = () => {
    setNewDeck({
      name: '',
      imageUrl: '',
      cards: [],
      attributes: [],
    });
  };
  const onDeckCreated = (value: PersistedDeck) => {
    if (decks) {
      setDecks([...decks, value]);
    }
    setNewDeck(undefined);
  };

  const onDeckEdit = (value: PersistedDeck) => setEditDeck(value);
  const onDeckUpdated = (value: PersistedDeck) => {
    if (decks) {
      setDecks(decks.map((existingDeck) => (value.id === existingDeck.id ? value : existingDeck)));
    }
    setEditDeck(undefined);
  };

  const onDeckDelete = (value: PersistedDeck) => setDeleteDeck(value);
  const onDeckDeleted = (value: PersistedDeck) => {
    if (decks) {
      setDecks(decks.filter((existingDeck) => existingDeck !== value));
    }
    setDeleteDeck(undefined);
  };

  useEffect(() => {
    Http.get<PersistedDeck[]>('/decks')
      .then((response) => {
        setDecks(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // always executed
      });
  }, []);

  const deckToEdit = newDeck || editDeck;
  return deckToEdit ? (
    <DeckEdit
      deck={deckToEdit}
      onUpdate={(updatedDeck) => {
        if (editDeck) {
          Http.patch<PersistedDeck>(`/decks/${editDeck.id}`, updatedDeck).then((response) => onDeckUpdated(response.data));
        } else {
          Http.post<PersistedDeck>('/decks', updatedDeck).then((response) => onDeckCreated(response.data));
        }
      }}
      onCancel={() => {
        setEditDeck(undefined);
        setNewDeck(undefined);
      }}
      confirmText={newDeck ? 'Save' : 'Update'}
    />
  ) : (
    decks && (
      <>
        <DeckGrid decks={decks} onDeckEdit={onDeckEdit} onDeckAdd={onDeckAdd} onDeckDelete={onDeckDelete} />
        <ConfirmationDialog
          open={!!deleteDeck}
          title="Delete deck"
          text={`Are you sure you want to delete deck '${deleteDeck?.name}'?`}
          onConfirm={() => deleteDeck && Http.delete(`/decks/${deleteDeck.id}`).then(() => onDeckDeleted(deleteDeck))}
          onClose={() => setDeleteDeck(undefined)}
        />
      </>
    )
  );
}

export default DeckAdmin;
