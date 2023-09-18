import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { AlertTitle, TextField } from '@mui/material';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { encodeAudio, handleDownload } from './AudioSteg';
import { encodeImage } from './ImageSteg';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem',
    marginBottom: '5rem',
  },
  input: {
    marginBottom: '2rem',
  },
  imageInput: {
    display: 'none',
  },
  button: {},
};

const Encrypt2 = () => {
  const [originalFile, setOriginalFile] = useState(null);
  const [secretMessage, setSecretMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);
  const [isEncodingComplete, setIsEncodingComplete] = useState(false);
  const [fileType, setFileType] = useState('');
  const downloadLinkRef = useRef(null);
  const [encodedAudioBlob, setEncodedAudioBlob] = useState('');
  const encryptionKey = useSelector((state) => state.key.publicKey);
  // console.log('enc:', encryptionKey);

  const downloadAudio = (encodedAudioBlob) => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = URL.createObjectURL(encodedAudioBlob);
      downloadLinkRef.current.download = 'encoded_audio.wav';
      downloadLinkRef.current.click();
    }
  };
  const handleDownload = () => {
    downloadAudio(encodedAudioBlob);
  };

  const handleEncode = async () => {
    if (fileType === 'image') {
      try {
        const encodedDataUrl = await encodeImage(
          originalFile,
          secretMessage.padEnd(100, '$'),
          encryptionKey
        );
        setEncodedImage(encodedDataUrl);
        setIsEncodingComplete(true);
      } catch (error) {
        console.error(error);
      }
    } else if (fileType === 'audio') {
      const encodedAudioBlob1 = await encodeAudio(
        originalFile,
        secretMessage.padEnd(100, '$'),
        encryptionKey,
        downloadLinkRef
      );
      setEncodedAudioBlob(encodedAudioBlob1);
      setIsEncodingComplete(true);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      setOriginalFile(file);
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

  const handleSecretMessageChange = (event) => {
    setSecretMessage(event.target.value);
  };

  return (
    <Container style={styles.root}>
      <Typography variant="h4" component="h1" gutterBottom>
        Encode Message
      </Typography>
      <Typography margin={2} width="90%">
        <Alert severity="info">
          To encode a message into an image, choose the image you want to use,
          enter your text and hit the Encode button. Save the last image, it
          will contain your hidden message. Remember, the more text you want to
          hide, the larger the image has to be. In case you chose an image that
          is too small to hold your message you will be informed. Neither the
          image nor the message you hide will be at any moment transmitted over
          the web, all the magic happens within your browser.
        </Alert>
      </Typography>

      <TextField
        label="Secret Message"
        value={secretMessage}
        onChange={handleSecretMessageChange}
        style={styles.input}
        sx={{ marginBottom: 3, width: '90%' }}
      />
      <input
        type="file"
        id="image-upload"
        // accept="image/*"
        style={styles.imageInput}
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
        <Button variant="contained" onClick={handleEncode}>
          Encode File
        </Button>
      </div>

      {isEncodingComplete && (
        <>
          {encodedImage && (
            <Alert severity="success" style={{ marginTop: 60 }}>
              <AlertTitle>Encoded Image</AlertTitle>
              <Typography variant="" align="start" style={styles.output}>
                <img
                  src={encodedImage}
                  alt="Encoded"
                  style={{ width: '500px', borderRadius: '5px' }}
                />
              </Typography>
            </Alert>
          )}
          {encodedAudioBlob && (
            <Alert severity="success" style={{ marginTop: 60 }}>
              <Typography>
                <a ref={downloadLinkRef} style={{ display: 'none' }} />
                <Button variant="contained" onClick={handleDownload} color='secondary'>
                  Download encoded audio
                </Button>
              </Typography>
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default Encrypt2;
