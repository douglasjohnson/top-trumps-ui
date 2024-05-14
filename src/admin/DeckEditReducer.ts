import Deck from '../types/Deck';
import Card from '../types/Card';
import AttributeType from '../types/AttributeType';

type State = {
  deck: Deck;
  addCard: boolean;
  editCard?: Card;
};
type Action =
  | { type: 'UPDATE_DECK_NAME'; name: string }
  | { type: 'UPDATE_DECK_IMAGE_URL'; imageUrl: string }
  | { type: 'DELETE_ATTRIBUTE'; attribute: AttributeType }
  | { type: 'NEW_ATTRIBUTE' }
  | { type: 'EDIT_CARD'; card?: Card }
  | { type: 'DELETE_CARD'; card: Card }
  | { type: 'ADD_CARD'; value: boolean }
  | { type: 'CARD_ADDED'; card: Card }
  | { type: 'CARD_EDITED'; card: Card }
  | { type: 'UPDATE_ATTRIBUTE_NAME'; attribute: AttributeType; name: string }
  | { type: 'UPDATE_ATTRIBUTE_UNITS'; attribute: AttributeType; units: string };

const DeckEditReducer = (state: State, action: Action) => {
  const newState = { ...state, deck: { ...state.deck } };
  switch (action.type) {
    case 'UPDATE_DECK_NAME':
      newState.deck.name = action.name;
      break;
    case 'UPDATE_DECK_IMAGE_URL':
      newState.deck.imageUrl = action.imageUrl;
      break;
    case 'DELETE_ATTRIBUTE':
      newState.deck.attributes = newState.deck.attributes.filter((value) => value !== action.attribute);
      newState.deck.cards = newState.deck.cards.map((deckCard) => ({
        ...deckCard,
        attributes: deckCard.attributes.filter((cardAttribute) => cardAttribute.type !== action.attribute.name),
      }));
      break;
    case 'NEW_ATTRIBUTE':
      newState.deck.attributes = [...newState.deck.attributes, { name: '', units: '' }];
      newState.deck.cards = newState.deck.cards.map((deckCard) => ({
        ...deckCard,
        attributes: [...deckCard.attributes, { type: '', value: 0 }],
      }));
      break;
    case 'EDIT_CARD':
      newState.editCard = action.card;
      break;
    case 'DELETE_CARD':
      newState.deck.cards = newState.deck.cards.filter((existingCard) => existingCard !== action.card);
      break;
    case 'ADD_CARD':
      newState.addCard = action.value;
      break;
    case 'CARD_ADDED':
      newState.deck.cards = [...newState.deck.cards, action.card];
      newState.addCard = false;
      break;
    case 'CARD_EDITED':
      newState.deck.cards = newState.deck.cards.map((existingCard) => (existingCard === newState.editCard ? action.card : existingCard));
      newState.editCard = undefined;
      break;
    case 'UPDATE_ATTRIBUTE_NAME':
      newState.deck.attributes = newState.deck.attributes.map((deckAttribute) =>
        deckAttribute === action.attribute ? { ...deckAttribute, name: action.name } : deckAttribute,
      );
      newState.deck.cards = newState.deck.cards.map((deckCard) => ({
        ...deckCard,
        attributes: deckCard.attributes.map((cardAttribute) =>
          cardAttribute.type === action.attribute.name ? { ...cardAttribute, type: action.name } : cardAttribute,
        ),
      }));
      break;
    case 'UPDATE_ATTRIBUTE_UNITS':
      newState.deck.attributes = newState.deck.attributes.map((deckAttribute) =>
        deckAttribute === action.attribute ? { ...deckAttribute, units: action.units } : deckAttribute,
      );
      break;
  }
  return newState;
};

export default DeckEditReducer;
