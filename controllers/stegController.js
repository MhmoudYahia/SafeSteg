const multer = require('multer');
const Jimp = require('jimp');
const catchAsync = require('../utils/catchAsync');
const PubAuth = require('../models/authority');
const User = require('../models/user');
const AppError = require('../utils/appError');
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
    const { message, sessionKey } = req.body;
    const { path: imagePath } = req.file;

    ////   karriiim
const binaryKey = sessionKey
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');

    ///////////////
    const canvas = document.createElement('canvas');
    canvas.width = imagePath.width;
    canvas.height = imagePath.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imagePath, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
  
    // Convert secret message to binary
    const binaryMessage = message
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');
  
    // Check if the image can hold the entire secret message
    if (binaryMessage.length > pixels.length) {
      throw new Error('The secret message is too large to be encoded in the image.');
    }
  
    let binaryIndex = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (binaryIndex < binaryMessage.length) {
        // Modify the least significant bit of each color channel
        pixels[i] = (pixels[i] & 0xFE) | (parseInt(binaryMessage[binaryIndex], 10) ^ parseInt(binaryKey[binaryIndex % binaryKey.length], 10));
        binaryIndex++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    var img = new Image();
    img.src = canvas.toDataURL();
    document.body.appendChild(img);
    res.sendFile(img);
  } catch (error) {
    console.error('Error encoding message:', error);
    res.status(500).send('Error encoding message.');
  }
};

// POST endpoint to decode the message from the steganographic image
exports.deStegImage = async (req, res) => {
  try {
    const { path: imagePath, sessionKey } = req.file;
    ////////
    const binaryKey = sessionKey
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');

    //////////////////
    const canvas = document.createElement('canvas');
    canvas.width = imagePath.width;
    canvas.height = imagePath.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imagePath, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
  
    let binaryMessage = '';
    let binaryIndex = 0; // Add this line to initialize binaryIndex
    for (let i = 0; i < pixels.length; i += 4) {
      binaryMessage += (pixels[i] & 1) ^ parseInt(binaryKey[binaryIndex % binaryKey.length], 10);
      binaryIndex++; // Increment binaryIndex after each iteration
    }
  
    // Convert binary message to string
    let secretMessage = '';
    for (let i = 0; i < binaryMessage.length; i += 8) {
      const byte = binaryMessage.substr(i, 8);
      const charCode = parseInt(byte, 2);
      if(charCode===33)
      {
        break;
      }
      secretMessage += String.fromCharCode(charCode);
    }
    ////////////
    // Respond with the decoded message
    res.send({ secretMessage });
  } catch (error) {
    console.error('Error decoding message:', error);
    res.status(500).send('Error decoding message.');
  }
};

exports.generateKeyFromAuthority = catchAsync(async (req, res, next) => {
  const { randomKey, senderEmail, receiverEmail } = req.body;

  const existingUser1 = await User.findOne({ email: senderEmail });
  if (!existingUser1)
    return next(new AppError("no user with email '" + senderEmail, 401));

  const existingUser2 = await User.findOne({ email: receiverEmail });
  if (!existingUser2)
    return next(new AppError("no user with email '" + receiverEmail, 401));

  const auth = await PubAuth.create({ senderEmail, receiverEmail });

  const key = auth.createSessionKey(randomKey);
  await auth.save();

  res.status(200).json({
    status: 'success',
    data: { sessionKey: key },
  });
});
exports.checkMeOnAuthority = catchAsync(async (req, res, next) => {
  const { receiverEmail } = req.body;

  const existingUser1 = await User.findOne({ email: receiverEmail });
  if (!existingUser1)
    return next(new AppError("no user with email '" + receiverEmail, 401));

  const auth = await PubAuth.findOne({ receiverEmail });

  if (!auth)
    return next(
      new AppError('no authority For your email, may be the key expired', 401)
    );

  res.status(200).json({
    status: 'success',
    data: { sesssionKey: auth.sessionKey },
  });
});
