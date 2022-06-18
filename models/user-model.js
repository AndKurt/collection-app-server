const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 3,
    min: 255,
  },
  password: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  firstName: {
    type: String,
    required: true,
    min: 1,
  },
  lastName: {
    type: String,
    required: true,
    min: 1,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('User', userSchema);
