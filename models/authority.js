const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'user should have an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  email: {
    type: String,
    required: [true, 'user should have an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  sessionKey: String,
  sessionKeyExpires: Date,
});

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpire = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
