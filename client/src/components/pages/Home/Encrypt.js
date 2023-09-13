import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { AlertTitle, TextField } from '@mui/material';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';


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
  const [originalImage, setOriginalImage] = useState(null);
  const [secretMessage, setSecretMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);
  const [isEncodingComplete, setIsEncodingComplete] = useState(false);

  const encryptionKey = useSelector(
    (state) => state.key.publicKey
  );
  console.log('enc:', encryptionKey);

  const handleEncode = async () => {
    try {
      const encodedDataUrl = await encodeImage(
        originalImage,
        secretMessage.padEnd(100, '$'),
        encryptionKey
      );
      setEncodedImage(encodedDataUrl);

      setIsEncodingComplete(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (event) => {
    setOriginalImage(event.target.files[0]);
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
        accept="image/*"
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
            Upload Image
          </Button>
        </label>
        <Button variant="contained" onClick={handleEncode}>
          Encode File
        </Button>
      </div>
      {isEncodingComplete && encodedImage && (
        <>
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
        </>
      )}
    </Container>
  );
};

export default Encrypt;

function encodeImage(imageFile, secretMessage, key) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);
    image.onload = () => {
      try {
        const encodedCanvas = encodeImageToCanvas(image, secretMessage, key);
        resolve(encodedCanvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = (error) => reject(error);
  });
}

function encodeImageToCanvas(image, secretMessage, key) {
  const binaryKey = key
    .split('')
    .map((char) =>
      char
        .charCodeAt(0)
        .toString(2)
        .padStart(8, '0')
    )
    .join('');

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const binaryMessage = secretMessage
    .split('')
    .map((char) =>
      char
        .charCodeAt(0)
        .toString(2)
        .padStart(8, '0')
    )
    .join('');

  if (binaryMessage.length > pixels.length) {
    throw new Error(
      'The secret message is too large to be encoded in the image.'
    );
  }

  let binaryIndex = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (binaryIndex < binaryMessage.length) {
      pixels[i] =
        (pixels[i] & 0xfe) |
        (parseInt(binaryMessage[binaryIndex], 10) ^
          parseInt(binaryKey[binaryIndex % binaryKey.length], 10));
      binaryIndex++;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
