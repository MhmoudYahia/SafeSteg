import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
  Skeleton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWrapper } from '../../../utils/fetchWrapper';
import { setAlertInfo, setShowAlert } from '../../../redux/alertSlice';

const styles = {
  root: {
    padding: '180px 90px',
    backgroundImage: 'url("/imgs/backg.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  avatar: {
    position: 'absolute',
    top: '-16%',
    'box-shadow': '0 0 7px 2px rgb(0,0,0,0.3)',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '10rem',
    height: '10rem',
    marginBottom: '1rem',
  },
  form: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  },
  button: {
    marginTop: '1.5rem',
    position: "relative",
    left:" 50%",
    transform: "translateX(-50%)",
  },
};

export const ProfilePage = () => {
  const user = useSelector((state) => state.user.userData);
  const loading = useSelector((state) => state.user.loading);

  if (loading) {
    return <Skeleton animation="wave" height={200} variant="rounded" />;
  }
  console.log(user);
  const dispatch = useDispatch();

  const [photo, setPhoto] = useState('');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handelSubmit = async (e) => {
    const formData = new FormData();
    if (photo) formData.append('photo', photo);
    formData.append('name', name);
    formData.append('email', email);

    const { message, data, status } = await fetchWrapper(
      `/users/changeme`,
      'PATCH',
      formData
    );

    if (status === 'success') {
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Your Data Updated successfully 🫡',
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
    <>
      <Grid container justifyContent="center" sx={styles.root}>
        <Grid item xs={12} md={8} lg={6}>
          <Card
            sx={{
              position: 'relative',
              overflow: 'unset !important',
              borderRadius: '57px',
              backgroundColor: '#d7e5ffbf',
              boxShadow: '0 0 10px 5px rgb(0,0,0,0.3)',
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  src={`/imgs/users/${user.photo}`}
                  alt={user.name}
                  sx={styles.avatar}
                />
              }
            />
            <CardContent sx={{ marginTop: '100px' }}>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: '54%',
                  top: '12%',
                  color: '#b4b4b4',
                  cursor: 'pointer',
                }}
              >
                <label htmlFor="photo-input">
                  <AddAPhotoIcon sx={{ fontSize: '40px', cursor: 'pointer' }} />
                  <input
                    id="photo-input"
                    type="file"
                    hidden
                    required
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setPhoto(file);
                    }}
                  />
                </label>
              </IconButton>

              <TextField
                label="Name"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                sx={styles.button}
                onClick={handelSubmit}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
