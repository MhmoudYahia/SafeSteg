import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

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
  for (let i = 0; i < pixels.length; i += 4) {
    binaryMessage +=
      (pixels[i] & 1) ^ parseInt(binaryKey[binaryIndex % binaryKey.length], 10);
    binaryIndex++;
  }

  let secretMessage = '';
  for (let i = 0; i < binaryMessage.length; i += 8) {
    const byte = binaryMessage.substr(i, 8);
    const charCode = parseInt(byte, 2);
    if (charCode === 33) {
      break;
    }
    secretMessage += String.fromCharCode(charCode);
  }

  return secretMessage;
}

function Encode() {
  const [originalImage, setOriginalImage] = useState(null);
  const [secretMessage, setSecretMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);
  const [isEncodingComplete, setIsEncodingComplete] = useState(false);
  const encryptionKey =
    '4590285d46f4c741de8b75f33505f43028d6936fdc938a486ceedcc324fa0dc5-rvkjkejvehvbt548rnrv-1694114402599';

  const handleEncode = async () => {
    try {
      const encodedDataUrl = await encodeImage(
        originalImage,
        secretMessage,
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
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <TextField
        label="Secret Message"
        value={secretMessage}
        onChange={handleSecretMessageChange}
      />
      <Button variant="contained" onClick={handleEncode}>
        Encode
      </Button>

      {isEncodingComplete && encodedImage && (
        <div>
          <h2>Encoded Image:</h2>
          <img src={encodedImage} alt="Encoded" />
        </div>
      )}
    </div>
  );
}

function Decode() {
  const [encodedImage, setEncodedImage] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isDecodingComplete, setIsDecodingComplete] = useState(false);
  const decryptionKey =
    '4590285d46f4c741de8b75f33505f43028d6936fdc938a486ceedcc324fa0dc5-rvkjkejvehvbt548rnrv-1694114402599';

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
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <Button variant="contained" onClick={handleDecode}>
        Decode
      </Button>

      {isDecodingComplete && (
        <div>
          <h2>Decoded Message:</h2>
          <p>{decodedMessage}</p>
        </div>
      )}
    </div>
  );
}

export { Decode, Encode };
