'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var express = require('express');
var Schema = mongoose.Schema;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');
var uuid = require('node-uuid');
var chaiHttp = require('chai-http');
var bodyParser = require('body-parser');
var should = chai.should();
var server = proxyquire('../compiled/server/server.js', {
  mongoose: {
    connect: function connect() {
      return true;
    },
  },
});
var hashStub = sinon.stub();
var compareStub = sinon.stub();
chai.use(chaiHttp);

describe('api/account', function (done) {
  var sandbox;
  var aServer;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    aServer = express();
    aServer.use(bodyParser.urlencoded({ extended: true }));
    aServer.use(bodyParser.json());
    aServer.set('superSecret', 'test');
  });

  afterEach(function () {
    sandbox.restore();
    aServer = null;
  });

  it('should handle signup normal situation', function (done) {
    var accountRoutes = proxyquire('../compiled/server/api/account', {
      '../models/user': {
        addUser: sinon.stub().resolves(true),
        findOne: sinon.stub().resolves(true),
        check: sinon.stub().resolves(true),
      },
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', accountRoutes(aServer));
    return chai.request(aServer).post('/api/signup').then(function (res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({ success: true, token: 'token' });
    }).catch((err) => {
      expect(false).to.equal(true);
    });
  });

  it('should handle signup not normal situation', function (done) {
    var err = new Error('error');
    var accountRoutes = proxyquire('../compiled/server/api/account', {
      '../models/user': {
        addUser: sinon.stub().rejects(err),
      },
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', accountRoutes(aServer));
    chai.request(aServer).post('/api/signup').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({
        success: false,
        message: 'There was an error registering you',
      });
      done();
    });
  });

  it('should handle no user with username', function (done) {
    var err = new Error('err');
    var accountRoutes = proxyquire('../compiled/server/api/account', {
      '../models/user': {
        findOne: sinon.stub().rejects(new Error('err')),
        check: sinon.stub().resolves(true),
      },
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', accountRoutes(aServer));
    chai.request(aServer).post('/api/signin').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Auth failed, no user',
      });
      done();
    });
  });

  it('should handle incorrect password', function (done) {
    var err = new Error('err');
    var accountRoutes = proxyquire('../compiled/server/api/account', {
      '../models/user': {
        findOne: sinon.stub().resolves(true),
        check: sinon.stub().resolves(false),
      },
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', accountRoutes(aServer));
    chai.request(aServer).post('/api/signin').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({
        success: false,
        message: 'Auth failed, wrong pass',
      });
      done();
    });
  });

  it('should handle correct password & successful log in', function (done) {
    var err = new Error('err');
    var accountRoutes = proxyquire('../compiled/server/api/account', {
      '../models/user': {
        findOne: sinon.stub().resolves(true),
        check: sinon.stub().resolves(true),
      },
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', accountRoutes(aServer));
    chai.request(aServer).post('/api/signin').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({
        success: true,
        message: 'Authentication successful',
        token: 'token',
      });
      done();
    });
  });
});

describe('api/newsfeed', function (done) {
  var sandbox;
  var aServer;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    aServer = express();
    aServer.use(bodyParser.urlencoded({ extended: true }));
    aServer.use(bodyParser.json());
    aServer.set('superSecret', 'test');
  });

  afterEach(function () {
    sandbox.restore();
    aServer = null;
  });

  it('should handle getting the newsfeed if all tweets are okay', function (done) {
    var tweetRoutes = proxyquire('../compiled/server/api/newsfeed', {
      '../models/tweet': {
        getNewsfeedTweets: sinon.stub().resolves([{
          created_at: 'a',
          getTweetInfo: sandbox.stub().resolves(true),
        }, {
          created_at: 'b',
          getTweetInfo: sandbox.stub().resolves(true),
        }]),
      },
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', tweetRoutes(aServer));
    chai.request(aServer).get('/api/newsfeed').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({ res: 'success', data: [true, true] });
      done();
    });
  });

  it('should handle signup not normal situation', function (done) {
    var tweetRoutes = proxyquire('../compiled/server/api/newsfeed', {
      '../models/tweet': {
        getNewsfeedTweets: sinon.stub().resolves([{
          created_at: 'a',
          getTweetInfo: sandbox.stub().resolves(true),
        }, {
          created_at: 'b',
          getTweetInfo: sandbox.stub().rejects(new Error()),
        }]),
      },
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', tweetRoutes(aServer));
    chai.request(aServer).get('/api/newsfeed').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.have.property('res', 'failure');
      done();
    });
  });

  it('newsfeed must call isAuthenticated middleware', function (done) {
    var s = sinon.stub().callsFake(function (app) {
      return function (req, res, next) {
        req.user = 'est';
        next();
      };
    });
    var tweetRoutes = proxyquire('../compiled/server/api/newsfeed', {
      '../models/tweet': {
        getNewsfeedTweets: sinon.stub().resolves([{
          created_at: 'a',
          getTweetInfo: sandbox.stub().rejects(new Error()),
        }, {
          created_at: 'b',
          getTweetInfo: sandbox.stub().rejects(new Error()),
        }]),
      },
      '../middlewares/isAuthenticated': s,
      jsonwebtoken: {
        sign: function sign() {
          return 'token';
        },
      },
    });
    aServer.use('/api', tweetRoutes(aServer));
    chai.request(aServer).get('/api/newsfeed').end(function (err, res) {
      expect(s.calledOnce).to.equal(true);
      done();
    });
  });
});

describe('api/profile', function (done) {
  var sandbox;
  var aServer;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    aServer = express();
    aServer.use(bodyParser.urlencoded({ extended: true }));
    aServer.use(bodyParser.json());
    aServer.set('superSecret', 'test');
  });

  afterEach(function () {
    sandbox.restore();
    aServer = null;
  });

  it('should handle getting a user profile', function (done) {
    var middleWareStub = sinon.stub();
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        getFormattedProfileById: sandbox.stub().resolves(true),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return middleWareStub.callsFake(function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        });
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).get('/api/profile/5/info').end(function (err, res) {
      res.should.be.a('object');
      expect(middleWareStub.calledOnce).to.equal(true);
      done();
    });
  });

  it('should handle getting a user profile', function (done) {
    var middleWareStub = sinon.stub();
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        getFormattedProfileById: sandbox.stub().resolves(true),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return middleWareStub.callsFake(function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        });
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).get('/api/profile/5/info').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({ res: 'success', data: true });
      done();
    });
  });

  it('should handle failure in getting user profile', function (done) {
    var e = new Error();
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        getFormattedProfileById: sandbox.stub().rejects(e),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).get('/api/profile/5/info').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.have.property('res', 'failure');
      done();
    });
  });

  it('should handle no id param passed into it', function (done) {
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        getFormattedProfileById: sandbox.stub().resolves(true),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).get('/api/profile/info').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({ res: 'success', data: true });
      done();
    });
  });

  it('should edit the profile', function (done) {
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        updateUserProfile: sandbox.stub().resolves({
          name: 'abhi',
          species: 'test',
          image: 'whee',
        }),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).post('/api/profile/edit').type('form').send({
      name: 'abhi',
      species: 'test',
      image: 'whee',
    }).end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({
        res: 'success',
        data: { name: 'abhi', species: 'test', image: 'whee' },
      });
      done();
    });
  });

  it('should edit the profile', function (done) {
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        updateUserProfile: sandbox.stub().rejects(),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).post('/api/profile/edit').type('form').send({
      name: 'abhi',
      species: 'test',
      photo: 'whee',
    }).end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.have.property('res', 'failure');
      done();
    });
  });

  it('should follow a user', function (done) {
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        follow: sandbox.stub().resolves(true),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).post('/api/profile/5/follow').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({ res: 'success', data: true });
      done();
    });
  });

  it('should follow a user and handle errors', function (done) {
    var profileRoutes = proxyquire('../compiled/server/api/profile', {
      '../models/user': {
        follow: sandbox.stub().rejects(),
      },
      '../models/tweet': {},
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', profileRoutes(aServer));
    chai.request(aServer).post('/api/profile/5/follow').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.have.property('res', 'failure');
      done();
    });
  });
});

describe('api/tweet', function (done) {
  var sandbox;
  var aServer;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    aServer = express();
    aServer.use(bodyParser.urlencoded({ extended: true }));
    aServer.use(bodyParser.json());
    aServer.set('superSecret', 'test');
  });

  afterEach(function () {
    sandbox.restore();
    aServer = null;
  });

  it('should handle favoriting a tweet', function (done) {
    var tweetRoutes = proxyquire('../compiled/server/api/tweet', {
      '../models/tweet': {
        favoriteTweet: sandbox.stub().resolves(true),
      },
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', tweetRoutes(aServer));
    chai.request(aServer).post('/api/tweet/5/favorite').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({ res: 'success', data: true });
      done();
    });
  });

  it('should handle favoriting a tweet error', function (done) {
    var tweetRoutes = proxyquire('../compiled/server/api/tweet', {
      '../models/tweet': {
        favoriteTweet: sandbox.stub().rejects(),
      },
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', tweetRoutes(aServer));
    chai.request(aServer).post('/api/tweet/5/favorite').end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.have.property('res', 'failure');
      done();
    });
  });

  it('should create and handle errors for tweet', function (done) {
    var tweetRoutes = proxyquire('../compiled/server/api/tweet', {
      '../models/tweet': {
        createTweet: sandbox.stub().resolves({ content: 'abhi' }),
      },
      '../middlewares/isAuthenticated': function middlewaresIsAuthenticated(app) {
        return function (req, res, next) {
          req.user = { _id: 'hi' };
          return next();
        };
      },
    });
    aServer.use('/api', tweetRoutes(aServer));
    chai.request(aServer).post('/api/tweet').type('form').send({
      content: 'abhi',
    }).end(function (err, res) {
      res.should.be.a('object');
      expect(res.body).to.deep.equal({
        res: 'success',
        data: { content: 'abhi' },
      });
      done();
    });
  });
});

