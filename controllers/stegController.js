const catchAsync = require('../utils/catchAsync');
const PubAuth = require('../models/authority');
const User = require('../models/user');
const AppError = require('../utils/appError');



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
