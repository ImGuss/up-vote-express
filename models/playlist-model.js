const mongoose = require('mongoose');
const User = require('./user-model');

const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    owner: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    pin: { type: Number },
    playlistId: { type: Number }
  },
  {
    timestamps: true
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);


module.exports = Playlist;
