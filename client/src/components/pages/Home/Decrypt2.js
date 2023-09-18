import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useSelector } from 'react-redux';
import { decodeAudio } from './AudioSteg';
import { decodeImage } from './ImageSteg';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem',
    marginBottom: '5rem',
  },
  imageInput: {
    display: 'none',
  },
  button: {},
  output: {
    marginTop: '4rem',
    textAlign: 'center',
  },
};

const Decrypt2 = () => {
  const [encodedFile, setEncodedFile] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isDecodingComplete, setIsDecodingComplete] = useState(false);
  const decryptionKey = useSelector((state) => state.key.publicKey);
  const [fileType, setFileType] = useState('');

  // console.log('dec:', decryptionKey);

  const handleDecode = async () => {
    if (fileType === 'image') {
      try {
        const decodedMessage = await decodeImage(encodedFile, decryptionKey);
        setDecodedMessage(decodedMessage);
        setIsDecodingComplete(true);
      } catch (error) {
        console.error(error);
      }
    } else if (fileType === 'audio') {
      const decodedMessage1 = await decodeAudio(encodedFile, decryptionKey);
      setDecodedMessage(decodedMessage1);
      setIsDecodingComplete(true);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      setEncodedFile(file);
      if (fileType.startsWith('image/')) {
        // The uploaded file is an imag
        console.log('Uploaded file is an image');
        setFileType('image');
      } else if (fileType.startsWith('audio/')) {
        // The uploaded file is an audio file
        console.log('Uploaded file is an audio');
        setFileType('audio');
      } else if (fileType.startsWith('video/')) {
        // The uploaded file is a video file
        console.log('Uploaded file is a video');
        setFileType('video');
      } else {
        // The uploaded file is of an unknown type
        console.log('Uploaded file is of an unknown type');

        setFileType('unknown');
      }
    }
  };

  return (
    <Container style={styles.root}>
      <Typography variant="h4" component="h1" gutterBottom>
        Decode a Massage
      </Typography>
      <Typography margin={2} width="90%">
        <Alert severity="info">
          To decode a hidden message from an image, just choose an image and hit
          the Decode button. Neither the image nor the message that has been
          hidden will be at any moment transmitted over the web, all the magic
          happens within your browser.
        </Alert>
      </Typography>
      <input
        // accept="image/*"
        style={styles.imageInput}
        id="image-upload"
        type="file"
        onChange={handleImageChange}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '90%',
        }}
      >
        <label htmlFor="image-upload">
          <Button variant="contained" component="span" style={styles.button}>
            Upload File
          </Button>
        </label>
        <Button variant="contained" onClick={handleDecode}>
          Decode File
        </Button>
      </div>
      {isDecodingComplete && (
        <>
          {/^[A-Za-z0-9\s.]+$/.test(decodedMessage.split('$$')[0]) ? (
            <Alert severity="success" style={{ width: '88%', marginTop: 60 }}>
              <AlertTitle>Extracted Text</AlertTitle>
              {decodedMessage.split('$$')[0]}
            </Alert>
          ) : (
            <Alert severity="error" style={{ width: '88%', marginTop: 60 }}>
              <AlertTitle>Error Message</AlertTitle>
              Wrong Key
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default Decrypt2;
