const express = require('express');
const request = require('request');

const User = require('../models/user-model');
const Playlist = require('../models/playlist-model');

const playlistRoute = express.Router();

const baseUrl = 'https://api.spotify.com/v1/users/';


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
        return;
      }

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
            res.status(500).json({ message: 'An error occurred when generating a pin. Please try again.' });
            return;
          }

          // if no playlist is found, send post to spotify api
          // to create one.

          const options = {
            url: `${baseUrl}${spotifyId}/playlists`,
            body: JSON.stringify({
              'name': 'My UpVote Playlist',
              'public': true,
              'collaborative': false,
              'description': 'Give your pin # to your friends so they can start adding music!'
            }),
            dataType: 'json',
            headers: {
              'Authorization': `Bearer ${req.body.accessToken}`,
              'Content-Type': 'application/json',
            }
          };

          request.post(options, (err, response, body) => {

            // save the pin, owner, and the playlistId to a new Playlist instance.
            const newPlaylist = new Playlist(
              {
                pin: randomNum,
                ownerId: req.user._id,
                owner: spotifyId,
                playlistId: body.id
              }
            );

            newPlaylist.save( (err) => {
              if (err) {
                next(err);
                return;
              }
              res.status(200).json(newPlaylist);
            });
          });
        }
      );
    }
  );
});

playlistRoute.post('/playlist/credentials/set', (req, res, next) => {

  console.log('~~~~IN CREDENTIALS SET');

  Playlist.findOneAndUpdate(
    // find the playlist by the owner
    { owner: req.body.spotifyId },
    // update the access from the body sent by angular, taken directly from owner
    {
      accessToken: req.body.accessToken,
      // refreshToken: req.body.refreshToken
    },
    (err, playlist) => {
      if (err) {
        next(err);
        return;
      }
      res.status(200).json(playlist);
    }
  );
});

playlistRoute.get('/:id/getpin', (req, res, next) => {

  const owner = req.params.id;

  Playlist.findOne(
    { owner: owner },
    (err, playlist) => {
      if (err) {
        next(err);
        return;
      }
      res.status(200).json(playlist);
    }
  );
});

playlistRoute.post('/search/playlists/public', (req, res, next) => {

  const pin = req.body.pin;

  // search database for pin number
  Playlist
    .findOne( { pin: pin } )
    .populate('ownerId')
    .exec( (err, playlist) => {
      if (err) {
        next(err);
        return;
      }
      res.status(200).json(playlist);
    }
  );
});





module.exports = playlistRoute;
