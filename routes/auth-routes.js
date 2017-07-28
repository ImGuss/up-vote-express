const express    = require('express');
const bcrypt     = require('bcrypt');
const passport   = require('passport');

const User       = require('../models/user-model');

const ensureLoggedIn = require('../lib/ensure-logged-in');

const authRoute = express.Router();

const failureUrl = 'http://localhost:4200/callback';
const successUrl = 'http://localhost:4200';


authRoute.get('/auth/spotify',
  passport.authenticate(
    'spotify',
    {
      scope: [
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'ugc-image-upload',
        'user-read-private',
        'user-read-email'
      ]
    }
  ),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

authRoute.get('/auth/spotify/callback',
  passport.authenticate('spotify',
  { failureRedirect: failureUrl }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(successUrl);
  }
);


authRoute.get('/loggedin', ensureLoggedIn, (req, res, next) => {
  res.status(200).json(req.user);
});

authRoute.get('/logout', (req, res, next) => {
  req.logout();
  console.log(req.user);
  res.status(200).json({ message: 'User logged out successfully' });
});


module.exports = authRoute;
