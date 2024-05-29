import PersistedDeck from '../types/PersistedDeck';
import { useState } from 'react';
import DeckCard from './DeckCard';
import { Grid } from '@mui/material';
import GameBoard from './GameBoard';
import { findAll } from '../service/DeckService';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function Game() {
  const [selectedDeck, setSelectedDeck] = useState<PersistedDeck>();

  const { data } = useSuspenseQuery({ queryKey: ['decks'], queryFn: findAll });

  return selectedDeck ? (
    <GameBoard deck={selectedDeck} />
  ) : (
    <Grid container spacing={2} justifyContent="center" alignContent="center">
      {data.map((deck) => (
        <Grid item key={deck.id}>
          <DeckCard deck={deck} onClick={() => setSelectedDeck(deck)} />
        </Grid>
      ))}
    </Grid>
  );
}
