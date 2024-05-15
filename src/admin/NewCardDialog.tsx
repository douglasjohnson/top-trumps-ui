import Card from '../types/Card';
import { useEffect, useState } from 'react';
import AttributeType from '../types/AttributeType';
import CardDialog from './CardDialog';

interface NewCardDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (card: Card) => void;
  attributes: AttributeType[];
}

const initialState = (attributes: AttributeType[]) => ({
  name: '',
  description: '',
  imageUrl: '',
  attributes: attributes.map((attribute) => ({
    type: attribute.name,
    value: 0,
  })),
});

export default function NewCardDialog({ open, onClose, onConfirm, attributes }: NewCardDialogProps) {
  const [card, setCard] = useState<Card>(initialState(attributes));

  useEffect(() => setCard(initialState(attributes)), [open, attributes]);

  return <CardDialog open={open} title="New Card" card={card} onClose={onClose} onConfirm={onConfirm} attributes={attributes} />;
}
