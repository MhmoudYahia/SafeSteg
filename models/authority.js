const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const authoritySchema = new mongoose.Schema({
  receiverEmail: {
    type: String,
    required: [true, 'enter sender email'],
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  senderEmail: {
    type: String,
    required: [true, 'enter receiver email'],
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  sessionKey: String,
  sessionKeyExpires: Date,
  createdAt: { type: Date, expires: '5m', default: Date.now() },
});

authoritySchema.methods.createSessionKey = function (random) {
  const token = crypto.randomBytes(32).toString('hex');

  const key = `${token}-${random}-${Date.now()}`.slice(0, 70);

  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');

  this.sessionKey = hashedKey;
  this.sessionKeyExpires = Date.now() + 60 * 5 * 1000; //5m

  return key;
};

authoritySchema.index({ senderEmail: 1, receiverEmail: -1 }, { unique: true });
// authoritySchema.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } );

module.exports = mongoose.model('PubAuth', authoritySchema);
