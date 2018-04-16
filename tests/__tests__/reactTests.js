const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import setupIntegrationTest from '../utils';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { Route, Switch, Link } from 'react-router';
import mainReducer from '../../compiled/src/reducers/mainReducer';
import authReducer from '../../compiled/src/reducers/authReducer';
import discoverReducer from '../../compiled/src/reducers/discoverReducer';
import messageReducer from '../../compiled/src/reducers/messageReducer';
import profileReducer from '../../compiled/src/reducers/profileReducer';
import tweetListReducer from '../../compiled/src/reducers/tweetListReducer';
import tweetReducer from '../../compiled/src/reducers/tweetReducer';

import * as authActions from '../../compiled/src/actions/auth';
import * as tweetActions from '../../compiled/src/actions/tweetActions';
import * as profileActions from '../../compiled/src/actions/profileActions';

import authReq from '../../compiled/src/utils/authenticatedRequest';

import App from '../../compiled/src/components/App';
import AuthHOC from '../../compiled/src/components/AuthHOC';
import CreateTweetBox from '../../compiled/src/components/CreateTweetBox';
import DiscoverBirds from '../../compiled/src/components/DiscoverBirds';
import EditProfile from '../../compiled/src/components/EditProfile';
import Flashes from '../../compiled/src/components/Flashes';
import Logout from '../../compiled/src/components/Logout';
import NavBar from '../../compiled/src/components/NavBar';
import NewsFeed from '../../compiled/src/components/NewsFeed';
import Profile from '../../compiled/src/components/Profile';
import ProfileBox from '../../compiled/src/components/ProfileBox';
import SignX from '../../compiled/src/components/SignX';
import Tweet from '../../compiled/src/components/Tweet';
import TweetList from '../../compiled/src/components/TweetList';


import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ReactWrapper } from 'enzyme';

describe('flash tests', () => {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  beforeEach(() => {
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      reducerSpy,
      messageReducer,
    });

    store = emptyStore(combinedReducers);
  });

  it('should handle rendering logic when error is dispatched', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Flashes />
        </MemoryRouter>
      </Provider>
    );
    store.dispatch({
      type: 'DUMMY_ACTION',
      error: 'this is an error',
    });
    sut.update();
    expect(sut.find('.alert.alert-danger').text()).toEqual('this is an error. Click to dismiss.');
  });

  it('should handle rendering logic when action with .message is dispatched', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Flashes />
        </MemoryRouter>
      </Provider>
    );
    store.dispatch({
      type: 'DUMMY_ACTION',
      message: 'this is a message',
    });
    sut.update();
    expect(sut.find('.alert.alert-info').text()).toEqual('this is a message. Click to dismiss.');
  });

  it('should change store when error and info are dispatched', () => {
    store.dispatch({
      type: 'DUMMY_ACTION',
      error: 'this is an error',
    });
    store.dispatch({
      type: 'DUMMY_ACTION',
      message: 'this is a message',
    });
    expect(store.getState().messageReducer).toEqual({
      messages: [{ messageType: 'error', message: 'this is an error' },
        { messageType: 'info', message: 'this is a message' }],
    });
  });

  it('should change store when error and info are dispatched and one is dismissed', () => {
    store.dispatch({
      type: 'DUMMY_ACTION',
      error: 'this is an error',
    });
    store.dispatch({
      type: 'DUMMY_ACTION',
      message: 'this is a message',
    });
    store.dispatch({
      type: 'DISMISS',
      idx: 1,
    });
    expect(store.getState().messageReducer).toEqual({
      messages: [{ messageType: 'error', message: 'this is an error' }],
    });
  });

  it('should change render when error and info are dispatched and one is dismissed', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Flashes />
        </MemoryRouter>
      </Provider>
    );

    store.dispatch({
      type: 'DUMMY_ACTION',
      error: 'this is an error',
    });
    store.dispatch({
      type: 'DUMMY_ACTION',
      message: 'this is a message',
    });

    sut.update();
    expect(sut.find('.alert.alert-info').length).toEqual(1);
    expect(sut.find('.alert.alert-danger').length).toEqual(1);
    store.dispatch({
      type: 'DISMISS',
      idx: 1,
    });
    sut.update();
    expect(sut.find('.alert.alert-info').length).toEqual(0);
    expect(sut.find('.alert.alert-danger').length).toEqual(1);
  });

  it('should change render when error and info are dispatched and one is dismissed', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Flashes />
        </MemoryRouter>
      </Provider>
    );

    store.dispatch({
      type: 'DUMMY_ACTION',
      error: 'this is an error',
    });
    store.dispatch({
      type: 'DUMMY_ACTION',
      message: 'this is a message',
    });

    sut.update();
    sut.find('.alert.alert-info').simulate('click');
    expect(sut.find('.alert.alert-info').length).toEqual(0);
    expect(sut.find('.alert.alert-danger').length).toEqual(1);
    sut.update();
    expect(store.getState().messageReducer).toEqual({
      messages: [{ messageType: 'error', message: 'this is an error' }],
    });
  });
});


describe('auth tests', () => {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  let FakeComponent;
  beforeEach(() => {
    let ls = require('../utils');
    global.localStorage = {
      getItem: function (key) {
        return this[key];
      },
      setItem: function (key, value) {
        this[key] = value;
      },
      removeItem: function (key) {
        delete this[key];
      },
    };
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      reducerSpy,
      authReducer,
    });

    store = emptyStore(combinedReducers);
    FakeComponent = () =>
      (
        <div className="fakeRoute">
          <h1>Test</h1>
        </div>
      );
  });
  it('renders signx page with 2  forms each col-md-6', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <div>
            <Switch>
              <Route path="/feed" component={FakeComponent} />
              <SignX />
            </Switch>
          </div>
        </MemoryRouter>
      </Provider>
    );
    expect(sut.find('.col-md-6').length).toEqual(2);
  });

  it('store should change isAuthenticated on LOGIN_FUL', () => {
    store.dispatch({
      type: 'LOGIN_FUL',
    });
    expect(store.getState().authReducer).toEqual({
      isAuthenticated: true,
    });
  });

  it('should call fetch on signin form submit  also store token to localstorage if successful', (done) => {

    global.fetch = jest.fn().mockImplementation((x, y) => {
      var p = new Promise((resolve, reject) => {
        resolve({
          ok: true,
          json: function () {
            return {
              success: true,
              token: 'test',
            };
          },
        });
      });
      return p;
    });
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <div>
            <Switch>
              <Route path="/feed" component={FakeComponent} />
              <SignX />
            </Switch>
          </div>
        </MemoryRouter>
      </Provider>
    );

    sut.find('form').first().simulate('submit');
    setTimeout(() => {
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual('/account/signin');
      expect(fetch.mock.calls[0][1]).toEqual({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: '', password: '' }),
      });
      expect(global.localStorage.getItem('token')).toEqual('test');
      done();
    }, 100);
  });

  it('should call fetch on signup form submit also store token to localstorage if successful', (done) => {
    global.fetch = jest.fn().mockImplementation((x, y) => {
      var p = new Promise((resolve, reject) => {
        resolve({
          ok: true,
          json: function () {
            return {
              success: true,
              token: 'test',
            };
          },
        });
      });
      return p;
    });
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <div>
            <Switch>
              <Route path="/feed" component={FakeComponent} />
              <SignX />
            </Switch>
          </div>
        </MemoryRouter>
      </Provider>
    );

    sut.find('form').at(1).simulate('submit');
    setTimeout(() => {
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual('/account/signup');
      expect(global.localStorage.getItem('token')).toEqual('test');
      done();
    }, 100);
  });
});


describe('AuthHOC tests', () => {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  let FakeComponent;
  let FakeComponent2;
  beforeEach(() => {
    let ls = require('../utils');
    global.localStorage = {
      getItem: function (key) {
        return this[key];
      },
      setItem: function (key, value) {
        this[key] = value;
      },
      removeItem: function (key) {
        delete this[key];
      },
    };
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      reducerSpy,
      authReducer,
    });

    store = emptyStore(combinedReducers);
    FakeComponent = () =>
      (
        <div className="fakeRoute">
          <h1>Test</h1>
        </div>
      );
    FakeComponent2 = () =>
      (
        <div className="fakeRoute">
          <h1>Test2</h1>
        </div>
      );
  });

  it('AuthHOC wrapped component should redirect to /signX when authenticated', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter initialRoute={['/one', '/signX']} initialIndex={0}>
          <div>
            <Switch>
              <Route path="/signX" component={FakeComponent2} />
              <Route default component={AuthHOC(FakeComponent)} />
            </Switch>
          </div>
        </MemoryRouter>
      </Provider>
    );
    sut.update();
    expect(sut.text()).toEqual('Test2');
  });
});


describe('discover birds tests', () => {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  let FakeComponent;
  beforeEach(() => {
    let ls = require('../utils');
    global.localStorage = {
      getItem: function (key) {
        return this[key];
      },
      setItem: function (key, value) {
        this[key] = value;
      },
      removeItem: function (key) {
        delete this[key];
      },
    };
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      reducerSpy,
      discoverReducer,
    });

    store = emptyStore(combinedReducers);
    FakeComponent = () =>
      (
        <div className="fakeRoute">
          <h1>Test</h1>
        </div>
      );
  });
  it('renders a div with a .card class', () => {
    const sut = mount(
      <Provider store={store}>
        <DiscoverBirds getDiscoverBirds={tweetActions.getDiscoverBirds} />
      </Provider>
    );
    expect(sut.find('.card').length).toEqual(1);
  });


  it('should render out list of birds linked to profiles by  dispatching getDiscoverBirds', (done) => {
    global.fetch = jest.fn().mockImplementation((x, y) => {
      var p = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function () {
            return {
              data: [{
                name: 'abhi',
                id: 'suri',
              }, {
                name: 'tim',
                id: 'lin',
              }],
            };
          },
        });
      });
      return p;
    });
    const sut = mount(
      <Provider store={store}>
        <DiscoverBirds
          getDiscoverBirds={() => store.dispatch(tweetActions.getDiscoverBirds())
          }
        />
      </Provider>
    );

    global.localStorage.setItem('token', 'test');
    store.dispatch(tweetActions.getDiscoverBirds()).then(() => {
      expect(fetch.mock.calls[0][0]).toEqual('/api/newsfeed/discover-birds');
      sut.update();
      expect(sut.find('a').length).toEqual(2);
      done();
    });
  });
});

describe('create tweet box tests', () => {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  let FakeComponent;
  beforeEach(() => {
    let ls = require('../utils');
    global.localStorage = {
      getItem: function (key) {
        return this[key];
      },
      setItem: function (key, value) {
        this[key] = value;
      },
      removeItem: function (key) {
        delete this[key];
      },
    };
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      reducerSpy,
    });

    store = emptyStore(combinedReducers);
    FakeComponent = () =>
      (
        <div className="fakeRoute">
          <h1>Test</h1>
        </div>
      );
  });
  it('renders a form-group class that calls a function createNewTweet on submit', () => {
    global.fetch = jest.fn().mockImplementation((x, y) => {
      var p = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function () {
            return {
              data: 'woo',
            };
          },
        });
      });
      return p;
    });
    const sut = mount(
      <Provider store={store}>
        <CreateTweetBox />
      </Provider>
    );
    expect(sut.find('.form-group').length).toEqual(1);
    sut.find('.form-group').simulate('submit');
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('/api/tweet');
  });
});


describe('create tweet list tests', () => {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  let FakeComponent;
  beforeEach(() => {
    let ls = require('../utils');
    global.localStorage = {
      getItem: function (key) {
        return this[key];
      },
      setItem: function (key, value) {
        this[key] = value;
      },
      removeItem: function (key) {
        delete this[key];
      },
    };
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      tweetList: tweetListReducer,
      tweet: tweetReducer,
    });

    store = emptyStore(combinedReducers);
    FakeComponent = () =>
      (
        <div className="fakeRoute">
          <h1>Test</h1>
        </div>
      );
  });
  it('the tweetList reducer stores ids and the tweet reducer stores tweet objects', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TweetList
            loadTweets={() => store.dispatch(tweetActions.loadTweets())}
          />
        </MemoryRouter>
      </Provider>
    );

    store.dispatch({
      type: 'LOADTWEETS_FUL',
      tweets: [{ tweetId: 1, content: 'test' },
        { tweetId: 2, content: 'test2' },
        { tweetId: 3, content: 'test3' }],
    });
    expect(store.getState().tweetList).toEqual({ ids: [1, 2, 3] });
    expect(store.getState().tweet).toEqual({
      1: { tweetId: 1, content: 'test' },
      2: { tweetId: 2, content: 'test2' },
      3: { tweetId: 3, content: 'test3' },
    });
  });

  it('tweetlist renders how tweet components', () => {
    const sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <TweetList
            loadTweets={() => store.dispatch(tweetActions.loadTweets())}
          />
        </MemoryRouter>
      </Provider>
    );

    store.dispatch({
      type: 'LOADTWEETS_FUL',
      tweets: [{ tweetId: 1, content: 'test' },
        { tweetId: 2, content: 'test2' },
        { tweetId: 3, content: 'test3' }],
    });
    sut.update();
    expect(sut.find('div.card').length).toEqual(3);
  });
});


describe('profile tests', () => {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  let FakeComponent;
  beforeEach(() => {
    let ls = require('../utils');
    global.localStorage = {
      getItem: function (key) {
        return this[key];
      },
      setItem: function (key, value) {
        this[key] = value;
      },
      removeItem: function (key) {
        delete this[key];
      },
    };
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      reducerSpy,
      profileReducer,
    });

    store = emptyStore(combinedReducers);
    FakeComponent = () =>
      (
        <div className="fakeRoute">
          <h1>Test</h1>
        </div>
      );
  });
  it('profile reducer should be able to handle GETPROFILE_FUL event', () => {
    let userObj = {
      name: 'abhi',
      species: 'bird',
      photo: 'http://www.google.com',
      followers: ['a', 'b'],
      following: ['1', '2'],
      isFollowing: true,
    };

    store.dispatch({
      type: 'GETPROFILE_FUL',
      profile: userObj,
    });
    expect(store.getState().profileReducer).toEqual({ profile: userObj });
  });
  it('profile box should render out profile information', () => {
    let sut = mount(
      <Provider store={store}>
        <ProfileBox
          id={5}
          user={() => store.dispatch({ type: 'DUMMY' })}
          favUnfav={() => store.dispatch({ type: 'DUMMY' })}
        />
      </Provider>
    );
    let userObj = {
      name: 'abhi',
      species: 'bird',
      photo: 'http://www.google.com',
      followers: ['a', 'b'],
      following: ['1', '2'],
      isFollowing: true,
    };

    store.dispatch({
      type: 'GETPROFILE_FUL',
      profile: userObj,
    });
    expect(sut.find('.btn.btn-primary').text()).toEqual('Unfollow');
  });
});

describe('navbar tests', function () {
  let store;
  let dispatchSpy;
  let reducerSpy;
  let emptyStore;
  let localStorage;
  let FakeComponent;
  beforeEach(() => {
    let ls = require('../utils');
    global.localStorage = {
      getItem: function (key) {
        return this[key];
      },
      setItem: function (key, value) {
        this[key] = value;
      },
      removeItem: function (key) {
        delete this[key];
      },
    };
    dispatchSpy = jest.fn(() => ({}));
    reducerSpy = (state, action) => dispatchSpy(action);
    emptyStore = applyMiddleware(thunk)(createStore);
    let combinedReducers = combineReducers({
      reducerSpy,
      authReducer,
    });

    store = emptyStore(combinedReducers);
    FakeComponent = () =>
      (
        <div className="fakeRoute">
          <h1>Test</h1>
        </div>
      );
  });

  it('should render out feed edit prof my prof and logout if isAuth is  true', () => {
    let sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </Provider>
    );
    store.dispatch({ type: 'LOGIN_FUL' });
    sut.update();
    expect(sut.find('li.nav-item').length).toEqual(4);
  });
  it('should render out feed edit prof my prof and logout if isAuth is  true', () => {
    let sut = mount(
      <Provider store={store}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </Provider>
    );
    store.dispatch({ type: 'LOGIN_REJ' });
    sut.update();
    expect(sut.find('li.nav-item').length).toEqual(1);
  });
});
