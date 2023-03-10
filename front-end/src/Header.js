import { Box, Grid, Typography, Paper } from '@mui/material';

function Header() {
  return (
    <Paper
      sx={{
        textAlign: 'center',
        backgroundColor: '#130201',
      }}
    >
      <Grid container xs={12}>
        <Grid item xs={12} md={3}>
          <a href='https://www.trainml.ai'>
            <img
              alt='logo'
              style={{
                width: '250px',
              }}
              src='https://www.trainml.ai/static/img/trainML-logo-purple.png'
            />
          </a>
        </Grid>
        <Grid item xs={12} md={9}>
          <Box textAlign='left'>
            <Typography variant='h3' sx={{ color: '#fff', paddingTop: '15px' }}>
              Large Language Model Endpoint
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Header;
