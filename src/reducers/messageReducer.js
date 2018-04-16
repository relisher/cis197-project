// TODO: createa reducer function messageReducer that has  an initialState
// { messages: [] }
// If any action has a property 'error' on it, then append to the messages
// array a new object
//    { messageType: 'error' if the  action has an error  property else 'info',
//      message: action.error if an error else action.message
//    }
// Also handle the case where the action type is DISMISS
// if that happens, then remove from the messages array the index supplied
// with the dismiss  action
// remember all these changes must be immutable (I use mutable language
// terms for simplicity
// STUB
let initialState = {
  messages: [],
};

const createMessage = (messageType, message) => ({
  messageType: messageType,
  message: message,
});

const messageReducer = (state = initialState, action) => {
  if (action.error) {
    return {
      messages: [...state.messages, createMessage('error', action.error)],
    };
  }
  if (action.message) {
    return {
      messages: [...state.messages, createMessage('info', action.message)],
    };
  }
  if (action.type === 'DISMISS') {
    return {
      messages: [
        ...state.messages.splice(0, action.idx),
        ...state.messages.splice(action.idx + 1),
      ],
    };
  } else {
    return state;
  }
};

// ENDSTUB

export default messageReducer;
