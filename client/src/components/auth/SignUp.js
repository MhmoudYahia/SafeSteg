import * as React from 'react';
import {
  TextField,
  FormControlLabel,
  CssBaseline,
  Button,
  Avatar,
  Checkbox,
  Box,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Container,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { setShowAlert, setAlertInfo } from '../../redux/alertSlice';
import { useDispatch } from 'react-redux';
import { fetchWrapper } from '../../utils/fetchWrapper';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="#">
        SafeSteg
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export const SignUp = () => {
  const dispatch = useDispatch();
  const [showPass1, setShowPass1] = React.useState(false);
  const [showPass2, setShowPass2] = React.useState(false);

  const his = useNavigate();

  const handleToggleShowPass2 = () => {
    setShowPass2(!showPass2);
  };
  const handleToggleShowPass1 = () => {
    setShowPass1(!showPass1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const { message, data, status, loading } = await fetchWrapper(
      '/users/signup',
      'POST',
      JSON.stringify({
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        password: formData.get('password'),
        passwordConfirm: formData.get('passwordConfirm'),
      }),
      {
        'Content-Type': 'application/json',
      }
    );
    if (status === 'success') {
      dispatch(
        setAlertInfo({
          severity: 'success',
          title: 'Message',
          message: 'Signed  Up Successfully, Thank You💖',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
      his('/signin');
    } else {
      dispatch(
        setAlertInfo({
          severity: 'error',
          title: 'try again',
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
      <Container component="main" maxWidth="xs" style={{ margin: '64px auto' }}>
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPass2 ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleShowPass2}
                          edge="end"
                          style={{ width: '50px' }}
                        >
                          {showPass2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirm Your Password"
                  type={showPass1 ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleShowPass1}
                          edge="end"
                          style={{ width: '50px' }}
                        >
                          {showPass1 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, 'background-color': COLORS.mainColor }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};
