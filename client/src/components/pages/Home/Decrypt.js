import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

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

const Decrypt = () => {
  const [encodedImage, setEncodedImage] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isDecodingComplete, setIsDecodingComplete] = useState(false);
  const decryptionKey = '4590285d46f4c741de8b75f33505f43028d6936fdc938a486ceedcc324fa0dc5-rvkjkejvehvbt548rnrv-1694114402599'.slice(
    0,
    70
  );

  const handleDecode = async () => {
    try {
      const decodedMessage = await decodeImage(encodedImage, decryptionKey);
      setDecodedMessage(decodedMessage);
      setIsDecodingComplete(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (event) => {
    setEncodedImage(event.target.files[0]);
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
        accept="image/*"
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
            Upload Image
          </Button>
        </label>
        <Button variant="contained" onClick={handleDecode}>
          Decode File
        </Button>
      </div>
      {isDecodingComplete && (
        <Alert severity="success" style={{ width: '88%', marginTop: 60 }}>
          <AlertTitle>Extracted Text</AlertTitle>

          {decodedMessage.split('$')[0]}
        </Alert>
      )}
    </Container>
  );
};

export default Decrypt;

function decodeImage(imageFile, key) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const decoded = decodeImageFromCanvas(canvas, key);
        resolve(decoded);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = (error) => reject(error);
  });
}

function decodeImageFromCanvas(canvas, key) {
  const binaryKey = key
    .split('')
    .map((char) =>
      char
        .charCodeAt(0)
        .toString(2)
        .padStart(8, '0')
    )
    .join('');

  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let binaryMessage = '';
  let binaryIndex = 0;
  console.log(pixels);
  for (let i = 0; i < pixels.length; i += 4) {
    binaryMessage +=
      (pixels[i] & 1) ^ parseInt(binaryKey[binaryIndex % binaryKey.length], 10);
    binaryIndex++;
  }

  let secretMessage = '';
  console.log(binaryMessage);
  for (let i = 0; i < binaryMessage.length; i += 8) {
    const byte = binaryMessage.substr(i, 8);
    const charCode = parseInt(byte, 2);

    if (i === 560) break;
    secretMessage += String.fromCharCode(charCode);
  }

  return secretMessage;
}
