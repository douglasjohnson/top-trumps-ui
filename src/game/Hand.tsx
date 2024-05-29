import PersistedDeck from '../types/PersistedDeck';
import Card from '../types/Card';
import Attribute from '../types/Attribute';
import { Typography } from '@mui/material';
import CardCard from './CardCard';
import DeckCard from './DeckCard';

interface HandProps {
  name: string;
  deck: PersistedDeck;
  cards?: Card[];
  onAttributeClick: (attribute: Attribute) => void;
  player: boolean;
}

export default function Hand({ name, deck, cards, onAttributeClick, player }: HandProps) {
  return (
    <>
      <Typography variant="h2">{name}</Typography>
      {cards && cards.length > 0 ? (
        player ? (
          <CardCard card={cards[0]} onClick={onAttributeClick} />
        ) : (
          <DeckCard deck={deck} />
        )
      ) : (
        <div>Out of cards</div>
      )}
    </>
  );
}
