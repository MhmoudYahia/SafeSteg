import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { Alert } from '@mui/material';
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

const Encrypt = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    // Perform image processing and text extraction here
    // Set the extracted text in the state using setOutputText function
  };
  const handleEncode = () => {
    // Perform encoding logic here using the message and file
    // Return the encoded file
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
        label="Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        style={styles.input}
        sx={{ marginBottom: 3, width: '90%' }}
      />
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
        <Button variant="contained" onClick={handleEncode}>
          Encode File
        </Button>
      </div>
    </Container>
  );
};

export default Encrypt;
