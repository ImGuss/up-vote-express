const express = require('express');

const User = require('../models/user-model');
const Playlist = require('../models/playlist-model');

const playlistRoute = express.Router();


playlistRoute.post('/playlist/create/:id', (req, res, next) => {

  // get parameter from url
  const spotifyId = req.params.id;
  // search for playlists with the owner of spotifyId
  Playlist.findOne(
    { owner: spotifyId },
    (err, playlist) => {
      if (err) {
        next(err);
        return;
      }

      // if one is found, send the pin
      if (playlist) {
        res.status(200).json(playlist);
      }

      // if none are found create one
      if (!playlist) {

        // generate a random 6 digit number for the pin
        let randomNum = Math.floor(Math.random()*900000) + 100000;

        // search for that number to make sure it doesn't exist in the database already
        Playlist.findOne(
          { pin: randomNum },
          (err, playlist) => {
            if (err) {
              next(err);
              return;
            }

            // if playlist is found, pin is already used. let user know to try one more time
            if (playlist) {
              res.status(500).json({ message: 'An error occurred when generating a pin. Please try again' });
            }

            // if no playlist is found, save the pin and the spotifyId to a new Playlist instance.
            if (!playlist) {
              const newPlaylist = new Playlist(
                {
                  pin: randomNum,
                  owner: req.body.spotifyId
                }
              );

              newPlaylist.save( (err) => {
                if (err) {
                  done(err);
                  return;
                }

                // return the new playlist
                done(null, newPlaylist);
              });
            }

          }
        );
      }
    }
  );
});



module.exports = playlistRoute;
