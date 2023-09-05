const AppError = require('../utils/appError');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');
const crypto = require('crypto');

const createAndSendToken = (res, user, statusCode) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRATIOND,
  });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  res.status(statusCode).json({
    status: 'success',
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createAndSendToken(res, newUser, 201);
});

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('missing email or password', 400));
  }

  const existingUser = await User.findOne({ email }).select('+password');
  if (!existingUser) {
    return next(new AppError('no user with this email', 401));
  }

  if (
    !(await existingUser.checkCorrectPassword(existingUser.password, password))
  ) {
    return next(new AppError('incorrect password', 401));
  }

  createAndSendToken(res, existingUser, 200);
};

exports.signout = async (req, res, next) => {
  res.cookie('jwt', 'signed out', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  let jwtToken;
  if (req.cookies) jwtToken = req.cookies.jwt;

  if (!jwtToken) return next(new AppError('Not authorized', 401));

  const payload = jwt.verify(jwtToken, process.env.JWT_KEY);

  const user = await User.findById(payload.id);

  if (!user) return next(new AppError('user does not exist', 401));

  if (user.isPasswordChangedAfter(payload.iat))
    return next(new AppError('password changed, resign in', 401));

  req.user = user;
  next();
};

exports.strictTo = catchAsync(async (req, res, next) => {});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new AppError('no user with this email', 404));

  const resetToken = existingUser.createResetToken();
  await existingUser.save({ validateBeforeSave: false });

  try {
    const emailClient = new Email(
      existingUser,
      `${req.protocol}://${req
        .get('host')
        .replace(/\d+$/, 3000)}/resetpassword/${resetToken}`
    );

    await emailClient.sendResetPasswordEmail();

    res.status(200).json({
      status: 'success',
      message: 'Token has been sent by email',
    });
  } catch (error) {
    existingUser.passwordResetToken = undefined;
    existingUser.passwordResetTokenExpire = undefined;
    await existingUser.save({ validateBeforeSave: false });

    return next(new AppError('error in sending the token by email', 400));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { confirmNewPassword, newPassword } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const userWithToken = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  if (!userWithToken) {
    return next(new AppError('token expired or invalid', 404));
  }

  userWithToken.password = newPassword;
  userWithToken.passwordConfirm = confirmNewPassword;
  userWithToken.passwordResetToken = undefined;
  userWithToken.passwordResetTokenExpire = undefined;

  await userWithToken.save();

  createAndSendToken(res, userWithToken, 200);
});
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassowrd } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.checkCorrectPassword(user.password, currentPassword))) {
    return next(new AppError('password is wrong', 400));
  }

  user.password = newPassword;
  user.passwordConfirm = confirmNewPassowrd;

  await user.save();

  createAndSendToken(res, user, 200);
});
