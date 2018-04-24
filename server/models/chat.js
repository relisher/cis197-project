const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const config = require('../config');
const uuidv1 = require('uuid/v1');

let chatSchema = new Schema({
  messages: [{ author: String, message: String }],
  chatId: String,
  members: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
});

chatSchema.statics.message = function (messagingId, messagedId, message) {
  return this.findOne( { members: { $all: [messagingId, messagedId] } } ).then((chat) => {
      if(!chat) {
        var memberIds = [messagingId, messagedId];
        var messageObj = {author: messagingId, message: message};
        var messageArray = [];
        var uid = uuidv1();
        messageArray.push(messageObj);
        var newMessage = new this({members: memberIds, chatId: uid, messages: messageArray});
        return newMessage.save();
      } else {
        var messageObj = {author: messagingId, message: message};
        chat.messages.push(messageObj);
        return chat.save();
      }
  });
}

chatSchema.statics.getMessages = function (messagingId, messagedId) {
  return this.findOne( { members: { $all: [messagingId, messagedId] } } ).then((chat) => {
    if(!chat) {
      var memberIds = [messagingId, messagedId];
      var messageArray = [];
      var uid = uuidv1();
      var newMessage = new this({members: memberIds, chatId: uid, messages: messageArray});
      return newMessage.save();
    } else {
      return chat;
    }
  });
}

module.exports = mongoose.model('Chat', chatSchema);
