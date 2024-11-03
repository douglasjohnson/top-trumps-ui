import useSWR from 'swr';
import { deleteDeck as deckServiceDelete, findAll, save, update } from '../service/DeckService';
import PersistedDeck from '../types/PersistedDeck';
import useSWRMutation from 'swr/mutation';
import Deck from '../types/Deck';

interface UseDeckResult {
  decks: PersistedDeck[];
  updateDeck: (deck: PersistedDeck) => Promise<PersistedDeck>;
  saveDeck: (deck: Deck) => Promise<PersistedDeck>;
  deleteDeck: (deck: PersistedDeck) => Promise<PersistedDeck>;
}

const useDeck = (): UseDeckResult => {
  const { data: decks } = useSWR('decks', findAll, { suspense: true });

  const { trigger: triggerUpdate } = useSWRMutation('decks', (_key, { arg }: { arg: PersistedDeck }) => update(arg));
  const updateDeck = async (deck: PersistedDeck) =>
    await triggerUpdate(deck, {
      optimisticData: decks.map((existingDeck) => (deck.id === existingDeck.id ? deck : existingDeck)),
      revalidate: false,
    });

  const { trigger: triggerSave } = useSWRMutation('decks', (_key, { arg }: { arg: Deck }) => save(arg));
  const saveDeck = async (deck: Deck) =>
    await triggerSave(deck, {
      optimisticData: [...decks, { ...deck, id: '' }],
      revalidate: true,
    });

  const { trigger: triggerDelete } = useSWRMutation('decks', (_key, { arg }: { arg: PersistedDeck }) => deckServiceDelete(arg));
  const deleteDeck = async (deck: PersistedDeck) =>
    await triggerDelete(deck, {
      optimisticData: () => decks.filter((existingDeck) => existingDeck !== deck),
      revalidate: false,
    });

  return {
    decks,
    updateDeck,
    saveDeck,
    deleteDeck,
  };
};

export default useDeck;
