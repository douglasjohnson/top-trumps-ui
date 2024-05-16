import { Card, CardMedia, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Stack sx={{ flex: 'auto', justifyContent: 'center', alignItems: 'center' }} direction="row" spacing={2}>
      <Link to="/build" aria-label="build" state={{ title: 'Build' }}>
        <Card>
          <CardMedia component="img" height="240" image="https://cdn.akamai.steamstatic.com/steam/apps/816240/capsule_616x353.jpg?t=1595857182" />
        </Card>
      </Link>
      <Link to="/play" aria-label="play" state={{ title: 'Play' }}>
        <Card>
          <CardMedia
            component="img"
            height="240"
            image="https://sm.pcmag.com/pcmag_uk/how-to/i/instant-co/instant-co-op-how-to-play-ps5-games-with-friends-using-share_n6u6.jpg"
          />
        </Card>
      </Link>
    </Stack>
  );
}
