const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image!', 400));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadImage = upload.single('photo');

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {currentUser: req.user},
  });
});

exports.changeMe = catchAsync(async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This is not for password', 400));
  }
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
