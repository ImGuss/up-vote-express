const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    owner: { type: Number },
    pin: { type: Number },
    playlistId: { type: Number }
  },
  {
    timestamps: true
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);


module.exports = Playlist;
