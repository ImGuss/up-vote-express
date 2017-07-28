const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String },
    username: { type: String },
    password: { type: String },

    facebookID: { type: String },
    spotifyID: { type: String },

    accessToken: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
