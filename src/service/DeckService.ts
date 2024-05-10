import Http from './Http';
import PersistedDeck from '../types/PersistedDeck';
import Deck from '../types/Deck';

const findAll = () =>
  new Promise<PersistedDeck[]>((resolve, reject) =>
    Http.get<PersistedDeck[]>('/decks')
      .then((response) => resolve(response.data))
      .catch(reject),
  );
const save = (deck: Deck) =>
  new Promise<PersistedDeck>((resolve, reject) =>
    Http.post<PersistedDeck>('/decks', deck)
      .then((response) => resolve(response.data))
      .catch(reject),
  );
const update = (deck: PersistedDeck) =>
  new Promise<PersistedDeck>((resolve, reject) =>
    Http.patch<PersistedDeck>(`/decks/${deck.id}`, deck)
      .then((response) => resolve(response.data))
      .catch(reject),
  );
const deleteDeck = (deck: PersistedDeck) =>
  new Promise<PersistedDeck>((resolve, reject) =>
    Http.delete(`/decks/${deck.id}`)
      .then(() => resolve(deck))
      .catch(reject),
  );

export { findAll, save, update, deleteDeck };
