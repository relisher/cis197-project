const router = require('express').Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const Tweet = require('../models/tweet');
const User = require('../models/user');

module.exports = function (app) {
  // TODO: check to see if user is authenticated
  // STUB
  router.use(isAuthenticated(app));
  // ENDSTUB

  router.get('/profile/:id?/info', function (req, res) {
    // TODO: This route will grab the information for a given profile. If no id is given,
    // look for the current user's profile. Use the getFormattedProfileById static method
    // in User. If there aren't any errors, return json in the format as follows:
    //  { res: 'success', data: profileInfoHere }
    // If there is an error, return json in the format as follows
    //  { res: 'failure', data: 'errorInstanceHere' }

    // STUB
    let user = req.params.id ? req.params.id : req.user._id;
    User.getFormattedProfileById(user, req.user._id)
      .then((profile) => {
        res.json({ res: 'success', data: profile });
      })
      .catch((err) => {
        res.json({ res: 'failure', data: err });
      });
    // ENDSTUB
  });

  router.get('/profile/:id?/tweets', function (req, res) {
    // TODO: refer to newsfeed for instructions. It is using the same logic.
    // if no id is specified, assume it is the current user.

    // STUB
    let user = req.params.id ? req.params.id : req.user._id;
    Tweet.getTweetsForUser(user)
      .then((tweets) => {
        tweets = tweets.sort((a, b) => {
          a = a.created_at ? new Date(a.created_at) : new Date(0);
          b = b.created_at ? new Date(b.created_at) : new Date(0);
          return b - a;
        });
        let pTweets = tweets.map(t => t.getTweetInfo(req.user._id));
        return Promise.all(pTweets);
      })
      .then((tweets) => {
        res.json({ res: 'succcess', data: tweets });
      })
      .catch((err) => {
        res.json({ res: 'failure', data: err });
      });
    // ENDSTUB
  });

  router.post('/profile/edit', function (req, res) {
    // TODO: accept the following form fields: name, species, and photo
    // Call updateUserProfile on this (with currentuser id, name, species, and photo as arguments)
    // if it is successful, send back a json object as follows:
    // { res: 'success', data: { name : newName, species: newSpecies: image: newPhoto } }
    // Otherwise
    // { res: 'failure', data: error }

    // STUB
    User.updateUserProfile(req.user._id, req.body.name, req.body.species, req.body.photo)
      .then((okay) => {
        let { name, species, image } = okay;
        res.json({ res: 'success', data: { name, species, image } });
      })
      .catch((err) => {
        res.json({ res: 'failure', data: err });
      });
    // ENDSTUB
  });

  router.post('/profile/:id/follow', function (req, res) {
    // TODO:  Call the User.follow method with the appropriate arguments.
    // will be of the form { res: 'success', data: 'following' or 'unfollowing' } */
    // STUB
    User.follow(req.user.id, req.params.id)
      .then((okay) => {
        console.log(okay);
        res.json({ res: 'success', data: okay });
      })
      .catch((err) => {
        res.json({ res: 'failure', data: err });
      });
    // ENDSTUB
  });

  return router;
};
