import React, { useState } from 'react';
import { Button, Grid, TextField, setRef } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setAlertInfo, setShowAlert } from '../../../redux/alertSlice';
import { fetchWrapper } from '../../../utils/fetchWrapper';

function generateRandomKey(distance) {
  // Use the mouse distance as a seed to generate a random key
  // Replace this with your own key generation logic

  const seed = Math.floor(distance);
  const generator = new Math.seedrandom(seed);
  const randomKey = generator().toString(16);
  return randomKey;
}

const PublicAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [mouseStartPosition, setMouseStartPosition] = useState(null);
  const [mouseDistance, setMouseDistance] = useState(0);
  const handleMouseMove = (event) => {
    if (mouseStartPosition) {
      const distance = Math.abs(event.clientX - mouseStartPosition.clientX);
      setMouseDistance(distance);
    }
  };

  const handleMouseClick = (event) => {
    setMouseStartPosition(event);
  };

  const handleGenerateKey = async () => {
    const key = generateRandomKey(mouseDistance);

    const { message, data, status, loading } = await fetchWrapper(
      '/stegs/authority-generateKey',
      'POST',
      JSON.stringify({
        receiverEmail,
        randomKey: key,
        senderEmail,
      }),
      {
        'Content-Type': 'application/json',
      }
    );
    if (status === 'success') {
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Done, the receiver has 5m to sign in to the authority❗💀',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
      setReceiverEmail("");
      setSenderEmail("");
      console.log(data);
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

  const handleCheckMe = async () => {
    const { message, data, status, loading } = await fetchWrapper(
      '/stegs/authority-checkme',
      'POST',
      JSON.stringify({
        receiverEmail: user.email,
      }),
      {
        'Content-Type': 'application/json',
      }
    );
    if (status === 'success') {
      dispatch(
        setAlertInfo({
          severity: 'success',
          message:
            'great, your are found on the authority. You can Steg now!☠️',
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
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="My Email (sender)"
          value={senderEmail}
          onChange={(event) => setSenderEmail(event.target.value)}
          fullWidth
          style={{ marginBottom: 10 }}
        />
        <TextField
          label="Receiver's Email"
          value={receiverEmail}
          onChange={(event) => setReceiverEmail(event.target.value)}
          fullWidth
        />
        <div
          style={{
            height: '200px',
            border: '1px solid black',
            marginTop: '20px',
            marginBottom: '20px',
            padding: '10px',
          }}
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
        >
          Click and Move the mouse in this area
        </div>
        <Button variant="contained" onClick={handleGenerateKey}>
          Start up an authority
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" onClick={() => handleCheckMe()}>
          Check Me
        </Button>
      </Grid>
    </Grid>
  );
};

export default PublicAuth;
