import PersistedDeck from '../types/PersistedDeck';
import Deck from '../types/Deck';

type State = {
  decks?: PersistedDeck[];
  deleteDeck?: PersistedDeck;
  editDeck?: PersistedDeck;
  newDeck?: Deck;
};
type Action =
  | { type: 'DECKS_LOAD_SUCCESS'; decks: PersistedDeck[] }
  | { type: 'DELETE_DECK'; deck: PersistedDeck }
  | { type: 'DELETE_DECK_CANCELLED' }
  | { type: 'EDIT_DECK'; deck: PersistedDeck }
  | { type: 'EDIT_DECK_CANCELLED' }
  | { type: 'NEW_DECK' }
  | { type: 'DECK_CREATED'; deck: PersistedDeck }
  | { type: 'DECK_UPDATED'; deck: PersistedDeck }
  | { type: 'DECK_DELETED'; deck: PersistedDeck };

const DeckAdminReducer = (state: State, action: Action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'DECKS_LOAD_SUCCESS':
      newState.decks = action.decks;
      break;
    case 'DELETE_DECK':
      newState.deleteDeck = action.deck;
      break;
    case 'EDIT_DECK':
      newState.editDeck = action.deck;
      break;
    case 'NEW_DECK':
      newState.newDeck = {
        name: '',
        imageUrl: '',
        cards: [],
        attributes: [],
      };
      break;
    case 'EDIT_DECK_CANCELLED':
      newState.editDeck = undefined;
      newState.newDeck = undefined;
      break;
    case 'DELETE_DECK_CANCELLED':
      newState.deleteDeck = undefined;
      break;
    case 'DECK_CREATED': {
      if (state.decks) {
        newState.decks = [...state.decks, action.deck];
      }
      newState.newDeck = undefined;
      break;
    }
    case 'DECK_UPDATED': {
      if (state.decks) {
        state.decks = state.decks.map((existingDeck) => (action.deck.id === existingDeck.id ? action.deck : existingDeck));
      }
      state.editDeck = undefined;
      break;
    }
    case 'DECK_DELETED': {
      if (state.decks) {
        state.decks = state.decks.filter((existingDeck) => existingDeck !== action.deck);
      }
      state.deleteDeck = undefined;
      break;
    }
  }
  return newState;
};

export default DeckAdminReducer;
