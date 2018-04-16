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
var Tweet = require('../compiled/server/models/tweet.js');
var should = chai.should();
var hashStub = sinon.stub();
var compareStub = sinon.stub();
var User = proxyquire('../compiled/server/models/user.js', {
  bcrypt: {
    compare: compareStub.resolves(true),
    hash: hashStub.resolves('apwiefjpawoe'),
  },
});

describe('tweetSchema', function () {
  it('should have an author field that is required', function (done) {
    var t = new Tweet();
    t.validate(function (err) {
      expect(err.errors.author.kind).to.equal('required');
      done();
    });
  });

  it('should have an author field that is of type ObjectId', function (done) {
    var t = new Tweet({ author: 'randomStringThatIsntObjectId' });
    t.validate(function (err) {
      expect(err.errors.author.kind).to.equal('ObjectID');
      done();
    });
  });

  it('should have a content field that is required', function (done) {
    var t = new Tweet();
    t.validate(function (err) {
      expect(err.errors.content.kind).to.equal('required');
      done();
    });
  });

  it('should have a content field that is of type String', function (done) {
    var t = new Tweet({ content: 'test' });
    t.validate(function (err) {
      expect(err.errors.content).to.not.exist;
      done();
    });
  });

  it('should have a favorites field that is an Array', function (done) {
    var t = new Tweet({ favorites: 'test' });
    t.validate(function (err) {
      expect(err.errors.favorites.kind).to.equal('Array');
      done();
    });
  });

  it('should have a favorites field conatins object ids in the array', function (done) {
    var t = new Tweet({ favorites: ['not object id'] });
    t.validate(function (err) {
      expect(err.errors.favorites.kind).to.equal('Array');
      done();
    });
  });
});

describe('tweet methods', function () {
  var sandbox;
  var author = mongoose.Types.ObjectId();
  var follower = mongoose.Types.ObjectId();
  var follower2 = mongoose.Types.ObjectId();
  var authorObject = { username: 'abhi', _id: author, image: 'imageHere' };
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });
  it('should return a promise that resolves if successful', function () {
    sandbox.stub(User, 'findOne').resolves(authorObject);
    var t = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [follower],
    });
    return t.getTweetInfo(follower).then(function (res) {
      expect(res).to.equal(res);
    });
  });
  it('should return a promise that rejects if User population fails', function () {
    sandbox.stub(User, 'findOne').rejects(new Error('err'));
    var t = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [follower],
    });
    return t.getTweetInfo(follower).then(function (res) {}).catch(function (err) {
      expect(err.message).to.equal('err');
    });
  });
  it('should return an object with props authorName, authorId, authorPic, content, tweetId, numFavorites, isFavorited', function () {
    sandbox.stub(User, 'findOne').resolves(authorObject);

    var t = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [follower],
    });
    return t.getTweetInfo(follower).then(function (res) {
      expect(res).to.deep.equal({
        authorName: authorObject.username,
        authorId: authorObject._id,
        authorPic: authorObject.image,
        content: t.content,
        tweetId: t._id,
        numFavorites: t.favorites.length,
        isFavorited: true,
      });
    });
  });
  it('should alter isFavorited depending if person viewing hasn\'t favorited tweet', function () {
    sandbox.stub(User, 'findOne').resolves(authorObject);

    var t = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [follower],
    });
    return t.getTweetInfo(follower2).then(function (res) {
      expect(res).to.deep.equal({
        authorName: authorObject.username,
        authorId: authorObject._id,
        authorPic: authorObject.image,
        content: t.content,
        tweetId: t._id,
        numFavorites: t.favorites.length,
        isFavorited: false,
      });
    });
  });
  it('should handle a getTweetsForUser call that has a successful find', function () {
    var t = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [follower],
    });
    sandbox.stub(Tweet, 'find').resolves([t]);

    return Tweet.getTweetsForUser(author).then(function (res) {
      expect(res).to.deep.equal([t]);
    });
  });
  it('should handle a getTweetsForUser call that has a reject', function () {
    var t = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [follower],
    });
    sandbox.stub(Tweet, 'find').rejects(new Error('err'));

    return Tweet.getTweetsForUser(author).catch(function (err) {
      expect(err.message).to.deep.equal('err');
    });
  });
  it('should get news feed tweets', function () {
    var user1 = new User({
      username: 'abhi',
      password: 'bleh',
      followers: [follower],
      following: [follower2],
    });
    sandbox.stub(User, 'findOne').resolves(user1);
    var t = new Tweet({
      author: follower2,
      content: 'tweet1',
      favorites: [follower],
    });
    var t2 = new Tweet({
      author: follower2,
      content: 'tweet2',
      favorites: [follower],
    });
    sandbox.stub(Tweet, 'find').resolves([t, t2]);

    return Tweet.getNewsfeedTweets(user1).then(function (res) {
      expect(res).to.deep.equal([t, t2]);
    });
  });
  it('should get news feed tweets if no following', function () {
    var user1 = new User({
      username: 'abhi',
      password: 'bleh',
      followers: [follower],
      following: [],
    });
    sandbox.stub(User, 'findOne').resolves(user1);
    var t = new Tweet({
      author: follower2,
      content: 'tweet1',
      favorites: [follower],
    });
    var t2 = new Tweet({
      author: follower2,
      content: 'tweet2',
      favorites: [follower],
    });
    sandbox.stub(Tweet, 'find').resolves([t, t2]);

    return Tweet.getNewsfeedTweets(user1).then(function (res) {
      expect(res).to.deep.equal([]);
    });
  });
  it('should createTweet', function () {
    var t = new Tweet({ author: follower2, content: 'tweet1', favorites: [] });
    sandbox.stub(User, 'findOne').resolves(authorObject);
    sandbox.stub(Tweet.prototype, 'save').resolves(t);

    return Tweet.createTweet(author, 'tweet1').then(function (res) {
      expect(res).to.deep.equal({
        authorName: authorObject.username,
        authorId: authorObject._id,
        authorPic: authorObject.image,
        content: t.content,
        tweetId: t._id,
        numFavorites: t.favorites.length,
        isFavorited: false,
      });
    });
  });
  it('should handle createTweet errors', function () {
    var t = new Tweet({ author: follower2, content: 'tweet1', favorites: [] });
    sandbox.stub(User, 'findOne').resolves(authorObject);
    sandbox.stub(Tweet.prototype, 'save').rejects(new Error('err'));

    return Tweet.createTweet(author, 'tweet1').catch(function (err) {
      expect(err.message).to.equal('err');
    });
  });

  it('should handle favoriteTweet', function () {
    var t = new Tweet({ author: author, content: 'tweet1', favorites: [] });
    var tNew = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [author],
    });
    sandbox.stub(Tweet, 'findOne').resolves(t);
    var s = sandbox.stub(Tweet.prototype, 'save').resolves(t);
    sandbox.stub(Tweet.prototype, 'getTweetInfo').resolves();
    return Tweet.favoriteTweet(author, t._id).then(function (res) {
      expect(s.calledOnce).to.equal(true);
      expect(s.calledOn(sinon.match(function (val) {
        return val.favorites[0] == author;
      }))).to.equal(true);
    });
  });

  it('should handle favoriteTweet unfavorite', function () {
    var t = new Tweet({
      author: author,
      content: 'tweet1',
      favorites: [author],
    });
    sandbox.stub(Tweet, 'findOne').resolves(t);
    var s = sandbox.stub(Tweet.prototype, 'save').resolves(t);
    sandbox.stub(Tweet.prototype, 'getTweetInfo').resolves();
    return Tweet.favoriteTweet(author, t._id).then(function (res) {
      expect(s.calledOnce).to.equal(true);
      expect(s.calledOn(sinon.match(function (val) {
        return val.favorites.length === 0;
      }))).to.equal(true);
    });
  });
});

describe('userSchema', function () {
  it('should have a username field that is required', function (done) {
    var t = new User();
    t.validate(function (err) {
      expect(err.errors.username.kind).to.equal('required');
      done();
    });
  });

  it('should have a password field that is required', function (done) {
    var t = new User();
    t.validate(function (err) {
      expect(err.errors.password.kind).to.equal('required');
      done();
    });
  });

  it('should have a following field that is an array', function (done) {
    var t = new User({ following: 'test' });
    t.validate(function (err) {
      expect(err.errors.following.kind).to.equal('Array');
      done();
    });
  });

  it('should have a following field conatins object ids in the array', function (done) {
    var t = new User({ following: ['not object id'] });
    t.validate(function (err) {
      expect(err.errors.following.kind).to.equal('Array');
      done();
    });
  });

  it('should have a followers field that is an array', function (done) {
    var t = new User({ followers: 'test' });
    t.validate(function (err) {
      expect(err.errors.followers.kind).to.equal('Array');
      done();
    });
  });

  it('should have a followers field conatins object ids in the array', function (done) {
    var t = new User({ followers: ['not object id'] });
    t.validate(function (err) {
      expect(err.errors.followers.kind).to.equal('Array');
      done();
    });
  });
});

describe('user methods', function () {
  var sandbox;
  var user = mongoose.Types.ObjectId();
  var user2 = mongoose.Types.ObjectId();
  var user3 = mongoose.Types.ObjectId();
  var username = 'abhi';
  var password = 'password';
  var species = 'bird';
  var photo = 'http://google.com';
  var name = 'name is abhi';
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });
  it('should return a user with hashed password', function () {
    var s = sandbox.stub(User.prototype, 'save').resolves('hi');
    return User.addUser(username, password, species, photo, name).then(function (res) {
      expect(s.calledOn(sinon.match(function (v) {
        return v.password.length > 0 && v.password != password;
      }))).to.equal(true);
    });
  });
  it('should return a user with hashed password', function () {
    var s = sandbox.stub(User.prototype, 'save').resolves('hi');
    return User.addUser(username, password, species, photo, name).then(function (res) {
      expect(s.calledOn(sinon.match(function (v) {
        return v.password.length > 0 && v.password != password;
      }))).to.equal(true);
    });
  });
  it('should check if user credentials', function () {
    var s = sandbox.stub(User, 'findOne').resolves('hi');
    return User.check(username, password).then(function (res) {
      expect(res).to.equal(true);
    });
  });
  it('should format profile correctly if following', function () {
    sandbox.stub(User, 'findOne').resolves({
      name: name,
      species: species,
      image: photo,
      followers: [user],
      following: [user2],
    });
    return User.getFormattedProfileById(user, user).then(function (res) {
      expect(res).to.deep.equal({
        name: name,
        species: species,
        image: photo,
        followers: [user],
        following: [user2],
        isFollowing: true,
      });
    });
  });
  it('should format profile correctly if not following', function () {
    sandbox.stub(User, 'findOne').resolves({
      name: name,
      species: species,
      image: photo,
      followers: [user2],
      following: [user2],
    });
    return User.getFormattedProfileById(user, user).then(function (res) {
      expect(res).to.deep.equal({
        name: name,
        species: species,
        image: photo,
        followers: [user2],
        following: [user2],
        isFollowing: false,
      });
    });
  });
  it('should format profile correctly if not following', function () {
    var user = new User({
      username: name,
      name: name,
      species: species,
      image: photo,
      followers: [user2],
      following: [user2],
    });
    sandbox.stub(User, 'findOne').resolves(user);
    var s = sandbox.stub(User.prototype, 'save').resolves('hi');
    return User.updateUserProfile(123, name + 'n', species + 'n', photo + 'n').then(function (res) {
      expect(s.calledOn(sinon.match(function (val) {
        return val.name === name + 'n' && val.species === species + 'n' && val.image === photo + 'n';
      }))).to.equal(true);
    });
  });

  it('should follow a user', function () {
    var user1 = new User({
      username: name,
      name: name,
      species: species,
      image: photo,
      followers: [],
      following: [],
    });
    var user2 = new User({
      username: name + '2',
      name: name,
      species: species,
      image: photo,
      followers: [],
      following: [],
    });
    var bool = false;
    sandbox.stub(User, 'findOne').onFirstCall().resolves(user1).onSecondCall().resolves(user2);
    var follower = sandbox.stub(User.prototype, 'save').resolves(true);
    return User.follow(user1._id, user2._id).then(function () {
      follower.calledOn(sinon.match(function (val) {
        if (val._id === user1._id) {
          bool = val.following[0] === user2._id;
        } else if (val._id === user2._id) {
          bool = val.followers[0] === user1._id;
        } else {
          bool = false;
        }
      }));
      expect(bool).to.equal(true);
    });
  });
  it('should unfollow a user', function () {
    var user2 = new User({
      username: name + '2',
      name: name,
      species: species,
      image: photo,
      followers: [],
      following: [],
    });
    var user1 = new User({
      username: name,
      name: name,
      species: species,
      image: photo,
      followers: [],
      following: [],
    });
    user2.followers.push(user1._id);
    user1.following.push(user2._id);
    var bool = false;
    sandbox.stub(User, 'findOne').onFirstCall().resolves(user1).onSecondCall().resolves(user2);
    var follower = sandbox.stub(User.prototype, 'save').resolves(true);
    return User.follow(user1._id, user2._id).then(function () {
      follower.calledOn(sinon.match(function (val) {
        if (val._id === user1._id) {
          bool = val.following.length === 0;
        } else if (val._id === user2._id) {
          bool = val.followers.length === 0;
        } else {
          bool = false;
        }
      }));
      expect(bool).to.equal(true);
    });
  });
});

