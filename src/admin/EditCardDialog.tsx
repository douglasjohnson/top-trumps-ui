import Card from '../types/Card';
import AttributeType from '../types/AttributeType';
import CardDialog from './CardDialog';

interface EditCardDialogProps {
  card: Card | undefined;
  onClose: () => void;
  onConfirm: (card: Card) => void;
  attributes: AttributeType[];
}

export default function EditCardDialog({ card, onClose, onConfirm, attributes }: EditCardDialogProps) {
  return card && <CardDialog open title="Edit Card" card={card} onClose={onClose} onConfirm={onConfirm} attributes={attributes} />;
}
