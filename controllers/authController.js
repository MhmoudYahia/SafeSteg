const AppError = require('../utils/appError');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const createAndSendToken = (res, user, statusCode) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRATIOND,
    }
  );

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  res.status(statusCode).json({
    status: 'success',
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

  const existingUser = await User.find({ email });
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

exports.protect = async (req, res, next) => {};
exports.strictTo = async (req, res, next) => {};
