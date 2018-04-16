import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import mainReducer from './reducers/mainReducer';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import App from './components/App';

// TODO: apply Middlewares thunkMiddleware and logger (thunks handle async stuff
// logger handles showing you how to get  to the next state
// create a store with these middlewares and the mainReducer
// STUB
let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);
let store = createStoreWithMiddleware(mainReducer);
// ENDSTUB

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
