import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '../../utils/alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { fetchWrapper } from '../../utils/fetchWrapper';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { setShowAlert, setAlertInfo } from '../../redux/alertSlice';
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

export const SignIn = () => {
  const his = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = React.useState(false);

  const handleToggleShowPass = () => {
    setShowPass(!showPass);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { message, data, status, loading } = await fetchWrapper(
      '/users/signin',
      'POST',
      JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
      {
        'Content-Type': 'application/json',
      }
    );
    if (status === 'success') {
      console.log(data);
      dispatch(setUser(data.user));
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Wellcome To Our Steganographer💖',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
      setTimeout(() => {
        his('/');
        window.location.reload();
      }, 3000);
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
      }, 6000);
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
              backgroundColor: COLORS.mainColor,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: 600, color: COLORS.mainColor }}
          >
            Sign in
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
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleShowPass}
                      edge="end"
                      style={{ width: '50px' }}
                    >
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: COLORS.mainColor }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgetpassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
