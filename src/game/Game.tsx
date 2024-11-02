import PersistedDeck from '../types/PersistedDeck';
import { useState } from 'react';
import DeckCard from './DeckCard';
import { Grid } from '@mui/material';
import GameBoard from './GameBoard';
import useDeck from '../hooks/useDeck';

export default function Game() {
  const [selectedDeck, setSelectedDeck] = useState<PersistedDeck>();

  const { decks } = useDeck();

  return selectedDeck ? (
    <GameBoard deck={selectedDeck} />
  ) : (
    <Grid container spacing={2} justifyContent="center" alignContent="center">
      {decks.map((deck) => (
        <Grid item key={deck.id}>
          <DeckCard deck={deck} onClick={() => setSelectedDeck(deck)} />
        </Grid>
      ))}
    </Grid>
  );
}
