import Deck from '../types/Deck';
import { Card, CardActionArea, CardHeader, CardMedia } from '@mui/material';

interface DeckCardProps {
  deck: Deck;
  onClick?: () => void;
}

export default function DeckCard({ deck, onClick = () => {} }: DeckCardProps) {
  return (
    <Card
      raised
      sx={{
        width: 200,
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: 320,
        }}
      >
        <CardHeader title={deck.name} />
        <CardMedia component="img" height="240" image={deck.imageUrl} />
      </CardActionArea>
    </Card>
  );
}
