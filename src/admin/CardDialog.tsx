import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import Card from '../types/Card';
import { useEffect, useState } from 'react';
import AttributeType from '../types/AttributeType';
import ImageUploadButton from './ImageUploadButton';

interface CardDialogProps {
  open: boolean;
  title: string;
  card: Card;
  onClose: () => void;
  onConfirm: (card: Card) => void;
  attributes: AttributeType[];
}

export default function CardDialog({ open, title, card, onClose, onConfirm, attributes }: CardDialogProps) {
  const [updatedCard, setUpdatedCard] = useState(card);

  const attributeUnits = (name: string) => attributes.find((attribute) => attribute.name === name)?.units;

  useEffect(() => {
    setUpdatedCard(card);
  }, [card]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} paddingTop={1}>
          <TextField label="Name" value={updatedCard.name} onChange={(event) => setUpdatedCard({ ...updatedCard, name: event.target.value })} />
          <TextField
            label="Description"
            multiline
            rows={4}
            value={updatedCard.description}
            onChange={(event) => setUpdatedCard({ ...updatedCard, description: event.target.value })}
          />
          <TextField
            label="Image"
            value={updatedCard.imageUrl}
            onChange={(event) => setUpdatedCard({ ...updatedCard, imageUrl: event.target.value })}
          />
          <ImageUploadButton onItemFinish={(url: string) => setUpdatedCard({ ...updatedCard, imageUrl: url })} />
          {updatedCard.attributes.map((attribute) => (
            <TextField
              key={attribute.type}
              label={attribute.type}
              value={attribute.value}
              InputProps={{
                endAdornment: <InputAdornment position="end">{attributeUnits(attribute.type)}</InputAdornment>,
              }}
              onChange={(event) => {
                setUpdatedCard({
                  ...updatedCard,
                  attributes: updatedCard.attributes.map((existingAttribute) => {
                    return attribute.type === existingAttribute.type
                      ? {
                          ...attribute,
                          value: Number(event.target.value),
                        }
                      : existingAttribute;
                  }),
                });
              }}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => onConfirm(updatedCard)}>
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
