const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    owner: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    pin: { type: Number },
    playlistId: { type: String },

    accessToken: { type: String },
    refreshToken: { type: String }
  },
  {
    timestamps: true
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);


module.exports = Playlist;
