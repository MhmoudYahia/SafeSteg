const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
