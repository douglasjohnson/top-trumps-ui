import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmationDialog({ open, title, text, onConfirm, onClose }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirmation-dialog-title" aria-describedby="confirmation-dialog-description">
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
