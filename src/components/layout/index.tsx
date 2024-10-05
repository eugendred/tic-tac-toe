import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';

export const BaseLayout: React.FC = () => (
  <Container maxWidth="lg">
    <Outlet />
  </Container>
);
