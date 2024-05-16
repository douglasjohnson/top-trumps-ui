import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();
  const title = location.state?.title ?? 'Home';

  return (
    <AppBar component="nav" position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Link to="/" state={{ title: 'Home' }}>
          <Button sx={{ color: 'white' }}>Home</Button>
        </Link>
        <Link to="/build" state={{ title: 'Build' }}>
          <Button sx={{ color: 'white' }}>Build</Button>
        </Link>
        <Link to="/play" state={{ title: 'Play' }}>
          <Button sx={{ color: 'white' }}>Play</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
