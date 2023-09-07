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
    const outimg = '';
    /////

    // Respond with the steganographic image file
    res.sendFile(outimg);
  } catch (error) {
    console.error('Error encoding message:', error);
    res.status(500).send('Error encoding message.');
  }
};

// POST endpoint to decode the message from the steganographic image
exports.deStegImage = async (req, res) => {
  try {
    const { path: imagePath, sessionKey } = req.file;

    // Respond with the decoded message
    res.send({ message });
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
