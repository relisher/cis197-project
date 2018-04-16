const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const config = require('./config');

// TODO: connect to our database via mongoose.connect. Grab the url from config.database
// STUB
mongoose.connect(process.env.MONGODB_URI || config.database);
// ENDSTUB

// load promisified functions into mongoose. Refer to
// http://erikaybar.name/using-es6-promises-with-mongoosejs-queries/ for more info
// TODO: Read that article. Our tests assume you're returning promises in your database
// queries!
mongoose.Promise = global.Promise;

// instantiate express app
const app = express();

// set the superSecret key in our app which we will use  to sign our jwts
app.set('superSecret', config.secret);
// instantiate bodyParser middleware so we can get fields from post requests via req.body.fieldName
app.use(bodyParser.urlencoded({ extended: true }));
// instatiate bodyParser to also handle requests with JSON and not just form data
app.use(bodyParser.json());

// static directory setup
app.use(express.static(path.join(__dirname, '..', 'public')));

// TODO: Import accountRoutes from ./api/account and mount them at /account
// ie we want urls of the form domain.com/account/signup  etc
// note  that our accountRoutes expect  the app to be passed  in
// ('./api/account' is actually a function that returns a router
// based on the  app that's passed in. The reason for  this is  that
// accounts uses the app secret key and we need to give it  a reference
// to the main app instantiation we made now.
// STUB
const accountRoutes = require('./api/account');
app.use('/account', accountRoutes(app));
// ENDSTUB

// TODO: import profile  routes from ./api/profile
// mount routes so that you can access routes as domain.com/api/profile/edit etc
// also pass in the app
// STUB
const profile = require('./api/profile');
app.use('/api', profile(app));
// ENDSTUB


// TODO:  import  tweet routes from ./api/tweet
// mount routes so that you can access routes as domain.com/api/tweet/
// also pass in the app
// STUB
const tweet = require('./api/tweet');
app.use('/api', tweet(app));
// ENDSTUB


// TODO: import newsfeed routes from ./api/newsfeed
// mount routes  so that you can access routes  as  domain.com/api/newsfeed
// also pass in the app
// STUB
const newsfeed = require('./api/newsfeed');
app.use('/api', newsfeed(app));
// ENDSTUB


// if we dont hit any api routes, then serve index.html from public
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// set up app to listen on port 3000  or any env port specified
app.listen(process.env.PORT || 3000, () => {
  console.log('listening on ' + (process.env.PORT || 3000));
});

// export app for testing purposes
module.exports = app;
