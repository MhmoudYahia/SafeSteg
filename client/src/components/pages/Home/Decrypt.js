import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem',
    marginBottom: '5rem'
  },
  imageInput: {
    display: 'none',
  },
  button: {

  },
  output: {
    marginTop: '4rem',
    textAlign: 'center',
  },
};

const Decrypt = () => {
  const [outputText, setOutputText] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // Perform image processing and text extraction here
    // Set the extracted text in the state using setOutputText function
  };
  const handleDecode = () => {
    // Perform encoding logic here using the message and file
    // Return the encoded file
  };
  return (
    <Container style={styles.root}>
      <Typography variant="h4" component="h1" gutterBottom>
        Decode a Massage
      </Typography>
        <Typography margin={2} width="90%">
          <Alert severity="info">
            To decode a hidden message from an image, just choose an image and
            hit the Decode button. Neither the image nor the message that has
            been hidden will be at any moment transmitted over the web, all the
            magic happens within your browser.
          </Alert>
        </Typography>
      <input
        accept="image/*"
        style={styles.imageInput}
        id="image-upload"
        type="file"
        onChange={handleImageUpload}
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
            Upload Image
          </Button>
        </label>
        <Button variant="contained" onClick={handleDecode}>
          Decode File
        </Button>
      </div>
      {outputText && (
        <Typography variant="body1" style={styles.output}>
          Extracted Text: {outputText}
        </Typography>
      )}
    </Container>
  );
};

export default Decrypt;
