import { Card as MuiCard, CardActionArea, CardContent, CardHeader, CardMedia, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Card from '../types/Card';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

interface CardCardProps {
  card: Card;
  onClick: () => void;
  onDelete: () => void;
}

export default function CardCard({ card, onClick, onDelete }: CardCardProps) {
  return (
    <MuiCard
      raised
      sx={{
        width: 200,
        height: 420,
      }}
    >
      <CardHeader
        title={card.name}
        titleTypographyProps={{
          fontSize: '1.2em',
        }}
        action={
          <IconButton
            aria-label="delete card"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            <DeleteRoundedIcon />
          </IconButton>
        }
      />
      <CardActionArea aria-label="edit card" onClick={onClick}>
        <CardMedia component="img" height="240" image={card.imageUrl} />
        <CardContent>
          <List dense disablePadding>
            {card.attributes.map((attribute, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={`${attribute.type} - ${attribute.value}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </CardActionArea>
    </MuiCard>
  );
}
