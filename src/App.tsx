import DeckAdmin from './admin/DeckAdmin';
import { Route, Routes } from 'react-router-dom';
import Game from './game/Game';
import Home from './Home';
import { Navigation } from './Navigation';
import { CircularProgress, Container } from '@mui/material';
import { Suspense, useContext, useState } from 'react';
import AuthContextProvider, { AuthContext } from './AuthContextProvider';

function App() {
  const { authenticated } = useContext(AuthContext);
  return (
    <>
      <Navigation />
      {authenticated && (
        <Container component="main" disableGutters sx={{ padding: 2, display: 'flex', flex: 'auto', textAlign: 'center' }}>
          <Suspense
            fallback={
              <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Container>
            }
          >
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route path="build" element={<DeckAdmin />} />
              <Route path="play" element={<Game />} />
            </Routes>
          </Suspense>
        </Container>
      )}
    </>
  );
}

export default function AuthApp() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <AuthContextProvider value={{ authenticated, onAuthenticationSuccess: () => setAuthenticated(true) }}>
      <App />
    </AuthContextProvider>
  );
}
