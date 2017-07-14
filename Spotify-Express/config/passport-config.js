const passport      = require('passport');
const bcrypt        = require('bcrypt');
const FbStrategy    = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

// what to save in the session
passport.serializeUser( (user, cb) => {
  cb(null, user._id);
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


// facebook strategy
passport.use(new FbStrategy(

  {
    clientId: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: 'auth/facebook/callback'
  },
  (accessToken, refreshToken, profile, done) =>{

    User.findOne(
      { facebookID: profile.id },

      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        if (foundUser) {
          done(null, foundUser);
          return;
        }

        if (!foundUser) {
          const theUser = new User({
            facebookID: profile.id,
            name: proifle, displayName
          });

          theUser.save( (err) => {
            if (err) {
              next(err);
              return;
            }

            // log them in
            done(null, theUser);
          });
        }
      }
    );
  }
));
