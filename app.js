const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');
const cors         = require('cors');

// load environment variables
require('dotenv').config();

// passport strategies
require('./config/passport-config');

mongoose.connect(process.env.MONGODB_URI);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Welcome to Spotify-App';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

app.use( session( {
  secret: 'this is a spotify playlist app, boiiiii',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  credentials: true,
  origin: [ 'http://localhost:4200' ]
}));
app.use(flash());

app.use( (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }

  next();
});



// BEGIN ROUTES
// ----------------------------------------
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use(authRoutes);

const spotifyRoutes = require('./routes/spotify-routes');
app.use(spotifyRoutes);

const playlistRoutes = require('./routes/playlist-routes');
app.use(playlistRoutes);

// ----------------------------------------
// END ROUTES

// Display the Angular app if no route matches
app.use((req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});




// BEGIN ERRORS
// ----------------------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(400).json({ message: 'Error: Something went wrong' });
});
// ----------------------------------------
// END ERRORS

module.exports = app;
