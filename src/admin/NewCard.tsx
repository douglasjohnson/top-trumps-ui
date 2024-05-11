import { Card, CardActionArea } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

interface NewCardProps {
  onClick: () => void;
}

export default function NewCard({ onClick }: NewCardProps) {
  return (
    <Card
      raised
      sx={{
        width: 200,
        height: 360,
      }}
    >
      <CardActionArea aria-label="create" onClick={onClick}>
        <AddRoundedIcon />
      </CardActionArea>
    </Card>
  );
}
