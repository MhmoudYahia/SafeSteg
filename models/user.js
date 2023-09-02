const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user should have a name'],
    trim: true,
    match: [
      new RegExp(/^[a-zA-Z\s]+$/),
      '{VALUE} is not valid. Please use only letters',
    ],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  email: {
    type: String,
    required: [true, 'user should have an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  password: {
    type: String,
    required: [true, 'user should have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user should have a confirmation password'],
    select: false,
    validate: {
      validator: function (ele) {
        return ele === this.password;
      },
      message: 'wrong confirmation password',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.checkCorrectPassword = async (storedPass, enteredPass) => {
  const isCorrect = await bcrypt.compare(enteredPass, storedPass);

  return isCorrect;
};
module.exports = mongoose.model('User', userSchema);
