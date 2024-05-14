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
      }}
    >
      <CardActionArea
        aria-label="new"
        onClick={onClick}
        sx={{
          height: 360,
        }}
      >
        <AddRoundedIcon fontSize="large" />
      </CardActionArea>
    </Card>
  );
}
