import { Card as MuiCard, CardContent, CardHeader, CardMedia, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Card from '../types/Card';
import Attribute from '../types/Attribute';

interface CardCardProps {
  card: Card;
  onClick: (attribute: Attribute) => void;
}

export default function CardCard({ card, onClick }: CardCardProps) {
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
      />
      <CardMedia component="img" height="240" image={card.imageUrl} />
      <CardContent>
        <List dense disablePadding>
          {card.attributes.map((attribute, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => onClick(attribute)}>
                <ListItemText primary={`${attribute.type} - ${attribute.value}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </MuiCard>
  );
}
