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

    if (i === 800) break;
    secretMessage += String.fromCharCode(charCode);
  }

  return secretMessage;
}
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

module.exports = { encodeImage, decodeImage };
