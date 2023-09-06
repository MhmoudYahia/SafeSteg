import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { COLORS } from '../../utils/colors';
import { useDispatch } from 'react-redux';
import { fetchWrapper } from '../../utils/fetchWrapper';
import { setAlertInfo, setShowAlert } from '../../redux/alertSlice';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        SafeSteg
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export const ForgetPassword = () => {
  const [email, setEmail] = React.useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      message,
      data,
      status,
    } = await fetchWrapper(
      `/users/forgetPassword`,
      'POST',
      JSON.stringify({ email }),
      { 'Content-Type': 'application/json' }
    );

    if (status === 'success') {
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Email has been Sent successfully🫡, check your inbox',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
    } else {
      dispatch(
        setAlertInfo({
          severity: 'error',
          message,
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'secondary.main',
              'background-color': COLORS.mainColor,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: 600, color: COLORS.mainColor }}
          >
            Forgot Password
          </Typography>
          <Typography style={{ padding: '16px 0px', color: '#989898' }}>
            Lost your password? Please enter your username or email address. You
            will receive a link to create a new password via email.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, 'background-color': COLORS.mainColor }}
            >
              send Reset Email
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/signin" variant="body2">
                  Remember your password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
