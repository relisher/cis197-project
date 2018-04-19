const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const config = require('../config');

let chatSchema = new Schema({
  messages: [{ author: String, message: String }],
  members: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
});

chatSchema.statics.message = function (messagingId, messagedId, message) {
  this.findOneOrCreate( { members: { $all: [messagingId, messagedId] } } ).then((chat) => {
      messageObj = {author: messagingId, message: message};
      chat.messages.push(messageObj);
      return chat.save();
  });
}

chatSchema.statics.getMessages = function (messagingId, messagedId) {
  return this.findOneOrCreate( { members: { $all: [messagingId, messagedId] } } );
}

// source: https://stackoverflow.com/questions/40102372/find-one-or-create-with-mongoose
chatSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc, callback) {
  const self = this;
  self.findOne(condition, (err, result) => {
    return result
      ? callback(err, result)
      : self.create(doc, (err, result) => {
        return callback(err, result);
      });
  });
};


module.exports = mongoose.model('Chat', chatSchema);
