const passport        = require('passport');
const bcrypt          = require('bcrypt');
const FbStrategy      = require('passport-facebook').Strategy;
const LocalStrategy   = require('passport-local').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

const User = require('../models/user-model');

// what to save in the session
passport.serializeUser( (user, cb) => {
  cb(null, user);
});


// where to get the user's info
passport.deserializeUser( (userId, cb) => {

  User.findById(userId, (err, theUser) => {

    if (err) {
      next(err);
      return;
    }

    cb(null, theUser);
  });
});


// local strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'
  },

  (loginUsername, loginPassword, next) => {

    User.findOne( {username: loginUsername },
      (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        if (!theUser) {
          next(null, false, { message: 'Incorrect username' });
          return;
        }

        if (!bcrypt.compareSync(loginPassword, theUser.password)) {
          next(null, false, { message: 'Incorrect password' });
          return;
        }

        next(null, theUser, { message: `Login for ${theUser.name} was successful!` });
      }
    );
  }
));


// spotify strategy
passport.use(new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_APP_ID,
    clientSecret: process.env.SPOTIFY_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/spotify/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    User.find(
      { spotifyID: profile.id },
      (err, user) => {
        if (err) {
          next(err);
          return;
        }

        if (user.length === 0) {
          const newUser = new User(
            {
              spotifyID: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken
            }
          );

          newUser.save( (err) => {
            if (err) {
              done(err);
              return;
            }

            done(null, newUser);
          });
        }

        if (user.length > 0) {
          // user.accessToken = accessToken;
          // user.refreshToken = refreshToken;
          User.findByIdAndUpdate(
            user[0]._id,
            {
              accessToken: accessToken,
              refreshToken: refreshToken
            },
            (err, theUser) => {
              console.log(user._id);
              console.log('\n','\n','THE USER~~~~~',theUser);
              if (err) {
                next(err);
                return;
              }
            }
          );
          done(err, user);
          return;
        }
      }
    );
  }
));
