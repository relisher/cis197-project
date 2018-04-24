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
  return this.findOne( { members: { $all: [messagingId, messagedId] } } ).then((chat) => {
      if(!chat) {
        var memberIds = [messagingId, messagedId];
        var messageObj = {author: messagingId, message: message};
        var newMessage = new this({members: memberIds, messages: messageObj});
        return newMessage.save();
      } else {
        var messageObj = {author: messagingId, message: message};
        chat.messages.push(messageObj);
        return chat.save();
      }
  });
}

chatSchema.statics.getMessages = function (messagingId, messagedId) {
  return this.findOne( { members: { $all: [messagingId, messagedId] } } );
}

module.exports = mongoose.model('Chat', chatSchema);
