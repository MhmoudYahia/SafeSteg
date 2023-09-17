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

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.user._id}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(
      `F:/MyRepos/SafeSteg/client/public/imgs/users/${req.file.filename}`
    );

  next();
};

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { currentUser: req.user },
  });
});

exports.changeMe = catchAsync(async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This is not for password', 400));
  }

  if (req.file) req.body.photo = req.file.filename;
  const newMe = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { newMe },
  });
});
