import Deck from '../types/Deck';
import { Card, CardActionArea, CardHeader, CardMedia, IconButton } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

interface DeckCardProps {
  deck: Deck;
  onClick: () => void;
  onDelete: () => void;
}

export default function DeckCard({ deck, onClick, onDelete }: DeckCardProps) {
  return (
    <Card
      raised
      sx={{
        width: 200,
        height: 360,
      }}
    >
      <CardHeader
        title={deck.name}
        action={
          <IconButton
            aria-label="delete"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            <DeleteRoundedIcon />
          </IconButton>
        }
      />
      <CardActionArea aria-label="edit" onClick={onClick}>
        <CardMedia component="img" height="240" image={deck.imageUrl} />
      </CardActionArea>
    </Card>
  );
}
