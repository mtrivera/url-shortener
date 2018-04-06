// server.js
// where your node app starts
'use strict';
// init project
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ShortURL = require('./models/shorturl');
const isUrl = require('url_validator');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
// http://expressjs.com/en/starter/static-files.html
app.use(bodyParser.json())
app.use(cors());

// Connect to databse
mongoose.connect(process.env.MONGODB_URI);

app.use(express.static('public'));

const api = '/new';

// Create the databse entry
app.get(api + '/:urlToShorten(*)', (req, res, next) => {
  // ES5: var urlToShorten = req.params.urlToShorten
  const { urlToShorten } = req.params;
  
  if (isUrl(urlToShorten)) {
    const short = Math.floor(Math.random()*100000).toString();
    
    const data = new ShortURL({
      original: urlToShorten,
      shortened: short
    });
    
    data.save(err => {
      if (err) {
        return res.send('Error saving to database');
      }
    }); 
    return res.json(data);
  }
  const data = new ShortURL({
    original: urlToShorten,
    shortened: 'Invalid Input. Please enter a valid URL'
  });
  return res.json(data);
});

// Query database and forward to original url
app.get('/:urlToForward', (req, res, next) => {
  const shortened = req.params.urlToForward;
  ShortURL.findOne({shortened}, (err, data) => {
    if (err) return res.send('Error reading database');
    
    const re = new RegExp('^(http|https)://', 'i');
    const strToCheck = data.original;
    
    if (re.test(data.original)) {
      res.redirect(301, data.original);
    } else {
      res.redirect(301, `http://${data.original}`);
    }
  });
});
  
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
