const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  favorites: {
    type: [Schema.Types.ObjectId],
    ref: 'Recipe'
  }
});

module.exports = model('User', UserSchema);
