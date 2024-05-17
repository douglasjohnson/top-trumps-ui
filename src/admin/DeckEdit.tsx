import Deck from '../types/Deck';
import { useReducer } from 'react';
import { Button, Container, Grid, IconButton, List, ListItem, ListItemButton, Stack, TextField } from '@mui/material';
import NewCard from './NewCard';
import NewCardDialog from './NewCardDialog';
import CardCard from './CardCard';
import DeleteIcon from '@mui/icons-material/Delete';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditCardDialog from './EditCardDialog';
import DeckEditReducer from './DeckEditReducer';
import ImageUploadButton from './ImageUploadButton';

interface DeckEditProps {
  deck: Deck;
  onConfirm: (deck: Deck) => void;
  onCancel: () => void;
  confirmText: string;
}

export default function DeckEdit({ deck, onConfirm, onCancel, confirmText }: DeckEditProps) {
  const [state, dispatch] = useReducer(DeckEditReducer, { deck, addCard: false });

  const updatedDeck = state.deck;
  const addCard = state.addCard;
  const editCard = state.editCard;

  return (
    <Container>
      <Stack spacing={2}>
        <TextField label="Name" value={updatedDeck.name} onChange={(event) => dispatch({ type: 'UPDATE_DECK_NAME', name: event.target.value })} />
        <TextField
          label="Image"
          value={updatedDeck.imageUrl}
          onChange={(event) => dispatch({ type: 'UPDATE_DECK_IMAGE_URL', imageUrl: event.target.value })}
        />
        <ImageUploadButton onItemFinish={(url: string) => dispatch({ type: 'UPDATE_DECK_IMAGE_URL', imageUrl: url })} />
        <List>
          {updatedDeck.attributes.map((attribute, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete attribute" onClick={() => dispatch({ type: 'DELETE_ATTRIBUTE', attribute })}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <TextField
                label="Attribute Name"
                value={attribute.name}
                onChange={(event) => dispatch({ type: 'UPDATE_ATTRIBUTE_NAME', attribute, name: event.target.value })}
              />
              <TextField
                label="Attribute Units"
                value={attribute.units}
                onChange={(event) => dispatch({ type: 'UPDATE_ATTRIBUTE_UNITS', attribute, units: event.target.value })}
              />
            </ListItem>
          ))}
          <ListItem>
            <ListItemButton aria-label="New attribute" onClick={() => dispatch({ type: 'NEW_ATTRIBUTE' })}>
              <AddRoundedIcon fontSize="large" />
            </ListItemButton>
          </ListItem>
        </List>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => onConfirm(updatedDeck)}>
            {confirmText}
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={2}>
        {updatedDeck.cards.map((card) => (
          <Grid key={card.name} item>
            <CardCard card={card} onClick={() => dispatch({ type: 'EDIT_CARD', card })} onDelete={() => dispatch({ type: 'DELETE_CARD', card })} />
          </Grid>
        ))}
        <Grid item>
          <NewCard onClick={() => dispatch({ type: 'ADD_CARD', value: true })} />
        </Grid>
      </Grid>
      <NewCardDialog
        attributes={updatedDeck.attributes}
        open={addCard}
        onClose={() => dispatch({ type: 'ADD_CARD', value: false })}
        onConfirm={(card) => dispatch({ type: 'CARD_ADDED', card })}
      />
      <EditCardDialog
        attributes={updatedDeck.attributes}
        card={editCard}
        onClose={() => dispatch({ type: 'EDIT_CARD', card: undefined })}
        onConfirm={(card) => dispatch({ type: 'CARD_EDITED', card })}
      />
    </Container>
  );
}
