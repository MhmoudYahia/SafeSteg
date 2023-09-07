const Jimp = require('jimp');

// Function to encode a message into an image
async function encodeMessage(imagePath, message, outputImagePath) {
  try {
    // Open the image using Jimp
    const image = await Jimp.read(imagePath);

    // Convert the message to binary
    const binaryMessage = Buffer.from(message, 'utf-8').toString('binary');

    // Check if the image can accommodate the message
    if (binaryMessage.length > image.bitmap.width * image.bitmap.height * 3) {
      throw new Error('Message is too large for the image.');
    }

    let messageIndex = 0;

    // Iterate over each pixel of the image
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      function (x, y, idx) {
        // Check if there are more message bits to encode
        if (messageIndex < binaryMessage.length) {
          // Get the RGB values of the current pixel
          const red = this.bitmap.data[idx];
          const green = this.bitmap.data[idx + 1];
          const blue = this.bitmap.data[idx + 2];

          // Modify the least significant bit (LSB) of each color value
          this.bitmap.data[idx] =
            (red & 0xfe) | (binaryMessage[messageIndex] >> 7);
          this.bitmap.data[idx + 1] =
            (green & 0xfe) | ((binaryMessage[messageIndex] >> 6) & 0x01);
          this.bitmap.data[idx + 2] =
            (blue & 0xfe) | ((binaryMessage[messageIndex] >> 5) & 0x03);

          messageIndex++;
        }
      }
    );

    // Save the modified image
    await image.writeAsync(outputImagePath);
    console.log('Message encoded successfully.');
  } catch (error) {
    console.error('Error encoding message:', error);
  }
}

// Function to decode a message from an image
async function decodeMessage(imagePath) {
  try {
    // Open the image using Jimp
    const image = await Jimp.read(imagePath);

    let binaryMessage = '';

    // Iterate over each pixel of the image
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      function (x, y, idx) {
        // Extract the LSB of each color value and append it to the binary message
        const redLSB = this.bitmap.data[idx] & 0x01;
        const greenLSB = this.bitmap.data[idx + 1] & 0x01;
        const blueLSB = this.bitmap.data[idx + 2] & 0x03;

        binaryMessage += (redLSB << 7) | (greenLSB << 6) | (blueLSB << 5);
      }
    );

    // Convert the binary message to text
    const message = Buffer.from(binaryMessage, 'binary').toString('utf-8');
    console.log('Decoded message:', message);
  } catch (error) {
    console.error('Error decoding message:', error);
  }
}

// Usage example
const imagePath = 'F:/MyRepos/SafeSteg/imgs/test.jpg'; // Provide the path to your input image
const message = 'This is a hidden message!'; // The message to encode

const outputImagePath = 'F:/MyRepos/SafeSteg/imgs/tested.jpg'; // Path to save the steganographic image

// Encode the message into the image
// encodeMessage(imagePath, message, outputImagePath);

// // Decode the message from the image
decodeMessage(outputImagePath);
