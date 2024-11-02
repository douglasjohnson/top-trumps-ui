import useSWR from 'swr';
import { findAll } from '../service/DeckService';
import PersistedDeck from '../types/PersistedDeck';

interface UseDeckResult {
  decks: PersistedDeck[];
}

const useDeck = (): UseDeckResult => {
  const { data } = useSWR('decks', findAll, { suspense: true });

  return {
    decks: data,
  };
};

export default useDeck;
