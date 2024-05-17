import { Grid } from '@mui/material';
import DeckCard from './DeckCard';
import NewCard from './NewCard';
import PersistedDeck from '../types/PersistedDeck';

interface DeckGridProps {
  decks: PersistedDeck[];
  onDeckEdit: (deck: PersistedDeck) => void;
  onDeckAdd: () => void;
  onDeckDelete: (deck: PersistedDeck) => void;
}

export default function DeckGrid({ decks, onDeckEdit, onDeckAdd, onDeckDelete }: DeckGridProps) {
  return (
    <Grid container spacing={2} justifyContent="center" alignContent="center">
      {decks &&
        decks.map((deck) => (
          <Grid item key={deck.id}>
            <DeckCard deck={deck} onClick={() => onDeckEdit(deck)} onDelete={() => onDeckDelete(deck)} />
          </Grid>
        ))}
      <Grid item>
        <NewCard onClick={onDeckAdd} />
      </Grid>
    </Grid>
  );
}
