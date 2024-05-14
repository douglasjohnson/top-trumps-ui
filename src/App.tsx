import './App.css';
import DeckAdmin from './admin/DeckAdmin';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Game from './game/Game';
import { Card, CardMedia, Stack } from '@mui/material';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <Stack direction="row" spacing={2}>
              <Link to="/build">
                <Card>
                  <CardMedia
                    component="img"
                    height="240"
                    image="https://cdn.akamai.steamstatic.com/steam/apps/816240/capsule_616x353.jpg?t=1595857182"
                  />
                </Card>
              </Link>
              <Link to="/play">
                <Card>
                  <CardMedia
                    component="img"
                    height="240"
                    image="https://sm.pcmag.com/pcmag_uk/how-to/i/instant-co/instant-co-op-how-to-play-ps5-games-with-friends-using-share_n6u6.jpg"
                  />
                </Card>
              </Link>
            </Stack>
          }
        />
        <Route path="build" element={<DeckAdmin />} />
        <Route path="play" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
