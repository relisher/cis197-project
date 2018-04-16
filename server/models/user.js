const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const config = require('../config');

// TODO: User schema should have the following.
// A `username` of type string  that is unique and required
// A `name` of type string
// a `password` of type string t hat is required
// a `species` that is type string (will be the bird species
// an `image` of type  string
// an array `following` containing objects of type Schema.ObjectId
// an array of `followers containing objects of  type Schema.ObjectId
let userSchema = new Schema({
  // STUB
  username: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  species: { type: String },
  image: { type: String, default: config.defaultPic },
  following: [{
    type: Schema.ObjectId,
  }],
  followers: [{
    type: Schema.ObjectId,
  }],
  // ENDSTUB
});


userSchema.statics.addUser = function (username, password, species, image, name) {
  // TODO: create a new user object with username, password, species, image, and name equal to  the
  // specified arguments. Once  this object is created, use bcrypt.hash to hash the
  // newUser.password  and set  the newUser's password equal to the hash. Finally call save
  // Must return  a  promise (ie your bcrypt hash call must look something like
  // bcrypt.hash(...).then(function( hash ) { ... return newUser.save() }
  // STUB
  let newUser = new this({
    username: username,
    password: password,
    species: species,
    image: image.length > 0 ? image : config.defaultPic,
    name: name,
  });
  return bcrypt.hash(newUser.password, 1).then((hash) => {
    newUser.password = hash;
    return newUser.save();
  });
  // ENDSTUB
};

userSchema.statics.check = function (username, password) {
  // determines if a given password for a username is valid  or not.
  // find a user with the username equivalent to the username passed in.
  // if  there is no  user then throw a new  Error('No User') else  return the result
  // of bcrypt.compare for the password and the user's password
  // STUB
  return this.findOne({ username: username })
    .then((user) => {
      if (!user) {
        throw new Error('No User');
      } else {
        return bcrypt.compare(password, user.password);
      }
    });
  // ENDSTUB
};

userSchema.statics.getFormattedProfileById = function (id, currentUserId) {
  // given an id and  a current user id (corresponding t o  the person looking at  the profile
  // return an object with the following structure
  //  {
  //    name:  ...,
  //    species: ...,
  //    image: ...,
  //    followers: ...,
  //    following: ...,
  //    isFollowing: true if currentUser is following user with _id == id, else false
  //  }
  //  If there is no user, throw a new  error 'No  such user with id'
  //  returns a promise
  //  STUB
  return this.findOne({ _id: id })
    .then((user) => {
      if (user) {
        return {
          name: user.name,
          species: user.species,
          image: user.image,
          followers: user.followers,
          following: user.following,
          isFollowing: user.followers.indexOf(currentUserId) > -1 ? true : false,
        };
      } else {
        throw new Error('No such user with id');
      }
    });
  // ENDSTUB
};

userSchema.statics.updateUserProfile = function (id, name, species, image) {
  // given  the parameters in the function, find the  user with  _id equal to id  and update their
  // name, species, and image.
  // save  the  user at the end
  // returns a promise.
  // STUB
  return this.findOne({ _id: id })
    .then((user) => {
      user.name = name;
      user.species = species;
      user.image = image.length > 0 ? image : config.defaultPic;
      return user.save();
    });
  // ENDSTUB
};

userSchema.statics.follow = function (followerId, followingId) {
  // given a followerId and followingId, update  the following and followers relationships like so;
  // Let u1 correspond to the  user with followerId an u2 correspond to the user with followingId
  //  (note  this is just  for explaining, you dont  need to have  these variable names)
  //  - if u1 is already following u2, remove u2 from the following array of u1 and from  the followers
  //    array of u2
  //  - if u1 isn't following u2 already, add u2 to  the following array of u1 and the followers
  //    array of u2.
  //  save both users
  //  returns a promise
  //  STUB
  let followerUser;
  let followingUser;
  let type;

  return this.findOne({ _id: followerId })
    .then((follower) => {
      followerUser = follower;
      return this.findOne({ _id: followingId });
    })
    .then((following) => {
      followingUser = following;
      if (followerUser.following.indexOf(followingUser._id) > -1) {
        type = 'unfollowing';
        followerUser.following.remove(followingUser);
      } else {
        type = 'following';
        followerUser.following.push(followingUser);
      }
      return followerUser.save();
    })
    .then((res) => {
      if (type === 'unfollowing') {
        followingUser.followers.remove(followerUser);
      } else {
        followingUser.followers.push(followerUser);
      }
      return followingUser.save();
    })
    .then(res => this.getFormattedProfileById(followingId, followerId));
  // ENDSTUB
};

module.exports = mongoose.model('User', userSchema);
