import DeckAdmin from './admin/DeckAdmin';
import { Route, Routes } from 'react-router-dom';
import Game from './game/Game';
import Home from './Home';
import { Navigation } from './Navigation';
import { Container } from '@mui/material';

export default function App() {
  return (
    <>
      <Navigation />
      <Container component="main" disableGutters sx={{ padding: 2, display: 'flex', flex: 'auto', textAlign: 'center' }}>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="build" element={<DeckAdmin />} />
          <Route path="play" element={<Game />} />
        </Routes>
      </Container>
    </>
  );
}
