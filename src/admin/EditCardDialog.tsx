import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import Card from '../types/Card';
import { useState } from 'react';
import AttributeType from '../types/AttributeType';

interface EditCardDialogProps {
  card: Card | undefined;
  onClose: () => void;
  onConfirm: (card: Card) => void;
  attributes: AttributeType[];
}

export default function EditCardDialog({ card, onClose, onConfirm, attributes }: EditCardDialogProps) {
  const [updatedCard, setUpdatedCard] = useState(card);

  const attributeUnits = (name: string) => attributes.find((attribute) => attribute.name === name)?.units;

  return (
    updatedCard && (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>New Card</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
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
    )
  );
}
