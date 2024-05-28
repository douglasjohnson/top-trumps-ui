import Http from './Http';
import PersistedDeck from '../types/PersistedDeck';
import Deck from '../types/Deck';

const DECK_FIELDS = `{
      id
      name
      imageUrl
      attributes {
        name
        units
      }
      cards {
        name
        description
        imageUrl
        attributes {
          type
          value
        }
      }
    }`;
const DECKS_QUERY = `
query {
  decks ${DECK_FIELDS}
}`;

const findAll = () =>
  new Promise<PersistedDeck[]>((resolve, reject) =>
    Http.post('/decks', {
      query: DECKS_QUERY,
    })
      .then((response) => resolve(response.data.data.decks))
      .catch(reject),
  );
const SAVE_MUTATION = `
mutation ($deck: CreateOnedecksInput!) {
  deckCreate(record: $deck) {
    record ${DECK_FIELDS}
  }
}`;
const save = (deck: Deck) => {
  return new Promise<PersistedDeck>((resolve, reject) =>
    Http.post('/decks', {
      query: SAVE_MUTATION,
      variables: {
        deck,
      },
    })
      .then((response) => resolve(response.data.data.deckCreate.record))
      .catch(reject),
  );
};
const UPDATE_MUTATION = `
mutation ($id: MongoID!, $deck: UpdateByIddecksInput!) {
  deckUpdate(_id: $id, record: $deck) {
    record ${DECK_FIELDS}
  }
}`;
const update = (deck: PersistedDeck) => {
  return new Promise<PersistedDeck>((resolve, reject) =>
    Http.post('/decks', {
      query: UPDATE_MUTATION,
      variables: {
        id: deck.id,
        deck: { ...deck, id: undefined },
      },
    })
      .then((response) => resolve(response.data.data.deckUpdate.record))
      .catch(reject),
  );
};
const DELETE_MUTATION = `
mutation ($id: MongoID!) {
  deckDelete(_id: $id) {
    record {
      id
    }
  }
}`;
const deleteDeck = (deck: PersistedDeck) => {
  return new Promise<PersistedDeck>((resolve, reject) =>
    Http.post('/decks', {
      query: DELETE_MUTATION,
      variables: {
        id: deck.id,
      },
    })
      .then(() => resolve(deck))
      .catch(reject),
  );
};

export { findAll, save, update, deleteDeck };
