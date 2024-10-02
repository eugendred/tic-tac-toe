import { Box, Typography, styled } from '@mui/material';

const StyledTitle = styled(Box)({
  fontSize: '4rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textShadow: `
    0 4px 0 #ccc,
    0 4px 0 #c9c9c9,
    0 4px 0 #bbb,
    0 4px 0 #b9b9b9,
    0 5px 0 #aaa,
    0 6px 1px rgba(0,0,0,.1),
    0 0 5px rgba(0,0,0,.1),
    0 1px 3px rgba(0,0,0,.3),
    0 3px 5px rgba(0,0,0,.2),
    0 5px 10px rgba(0,0,0,.25),
    0 10px 10px rgba(0,0,0,.2),
    0 20px 20px rgba(0,0,0,.15);
  `,
});

const NotFound = () => (
  <Box sx={{
    padding: '1rem',
    height: '94vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }}>
    <StyledTitle>Page Not Found</StyledTitle>
    <Typography variant="h6" component="div" gutterBottom>
      Sorry, the page you are looking for could not be found or has been removed.
    </Typography>
  </Box>
);

export default NotFound;
