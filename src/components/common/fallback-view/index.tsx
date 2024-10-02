import Backdrop from '@mui/material/Backdrop';

import { Spinner } from '../spinner';

export const FallbackView: React.FC = () => (
  <Backdrop
    open
    sx={{
      color: '#0000001c',
      zIndex: 9999,
    }}
  >
    <Spinner />
  </Backdrop>
);
