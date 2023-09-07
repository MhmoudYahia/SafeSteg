const multer = require('multer');
const Jimp = require('jimp');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image!', 400));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadImage = upload.single('image');

// POST endpoint to encode the message into the image
exports.enStegImage = async (req, res) => {
  try {
    const { message } = req.body;
    const { path: imagePath } = req.file;

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

    // Generate a new filename for the steganographic image
    const outputImagePath = `uploads/stegano_${Date.now()}.png`;

    // Save the modified image
    await image.writeAsync(outputImagePath);

    // Respond with the steganographic image file
    res.sendFile(outputImagePath);
  } catch (error) {
    console.error('Error encoding message:', error);
    res.status(500).send('Error encoding message.');
  }
};

// POST endpoint to decode the message from the steganographic image
exports.deStegImage = async (req, res) => {
  try {
    const { path: imagePath } = req.file;

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

    // Respond with the decoded message
    res.send({ message });
  } catch (error) {
    console.error('Error decoding message:', error);
    res.status(500).send('Error decoding message.');
  }
};
