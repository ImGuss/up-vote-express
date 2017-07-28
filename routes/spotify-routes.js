const express      = require('express');
const passport     = require('passport');
const request      = require('request');

const querystring  = require('querystring');
const cookieParser = require('cookie-parser');

const spotifyRoute = express.Router();

const client_id = process.env.SPOTIFY_APP_ID;
const client_secret = process.env.SPOTIFY_APP_SECRET;

const failureUrl = 'http://localhost:4200/callback';
const successUrl = 'http://localhost:4200';


const baseUrl = 'https://api.spotify.com/v1/users/';


// create playlist. gets body data from spotify service request.
spotifyRoute.post('/spotify/:id/playlists/create', (req, res, next) => {

  // set options
  const options = {
    url: `${baseUrl}${req.params.id}/playlists`,
    body: JSON.stringify({
        'name': req.body.listName,
        'public': true,
        'collaborative': false,
        'description': req.body.listDesc
    }),
    dataType:'json',
    headers: {
      'Authorization': `Bearer ${req.body.accessToken}`,
      'Content-Type': 'application/json',
    }
  };

  // post request
  request.post(options, (err, response, body) => {
    // send status to spotify service
    res.status(200).json(body);
  });
});

spotifyRoute.post('/spotify/:id/playlists', (req, res, next) => {
  // {user_id}/playlists

  // set options
  const options = {
    url: `${baseUrl}${req.params.id}/playlists`,
    dataType:'json',
    headers: {
      'Authorization': `Bearer ${req.body.accessToken}`,
    }
  };

  // get request
  request.get(options, (err, response, body) => {

    // convert json response into object
    const info = JSON.parse(body);
    // send body to spotify service
    res.status(200).json(info);
  });
});

spotifyRoute.post('/spotify/:id/playlists/:spotifyId', (req, res, next) => {

  // set options
  const options = {
    url: `${baseUrl}${req.params.id}/playlists/${req.params.spotifyId}`,
    dataType: 'json',
    headers: {
      'Authorization': `Bearer ${req.body.accessToken}`
    }
  };

  // get request
  request.get(options, (err, response, body) => {

    // convert json response into object
    const info = JSON.parse(body);
    // send body to spotify service
    res.status(200).json(info);
  });
});

spotifyRoute.post('/spotify/search', (req, res, next) => {

  const query = `q=${req.query.q}`;
  const type = `type=${req.query.type}`;
  const params = query + '&' + type;

  const options = {
    url: `https://api.spotify.com/v1/search?${params}`,
    dataType: 'json',
    headers: {
      'Authorization': `Bearer ${req.body.accessToken}`
    }
  };

  request.get(options, (err, response, body) => {
    console.log('\n','OPTIONS!!!~~~',options.url);
    const info = JSON.parse(body);
    res.status(200).json(info);
  });
});


module.exports = spotifyRoute;
