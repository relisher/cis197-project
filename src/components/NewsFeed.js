import React, { Component } from 'react';
import TweetList from './TweetList';
import DiscoverBirds from './DiscoverBirds';
import { connect } from 'react-redux';
import { loadTweets, getDiscoverBirds } from '../actions/tweetActions';

class NewsFeed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: render out this component that is the newsfeed
    // should render out the DiscoverBirds component
    // note that it needs a property getDisocverBirds that
    // is a function which dispatches the getDiscoverBirds action
    // also needs to mount TweetList with a property
    // loadTweets that is a function which dispatches the
    // loadTweets action.
    // ultimate html structure will look like
    // <div class="container">
    //  <h2>News Feed</h2>
    //  <div class="row">
    //    <div class="col-md-4">
    //      ...discoverbirds
    //    </div>
    //    <div class="col-md-8">
    //      ...tweetlist
    //    </div>
    //  </div>
    // </div>
    // STUB
    return (
      <div className="container">
        <h2>News Feed</h2>
        <div className="row">
          <div className="col-md-4">
            <DiscoverBirds getDiscoverBirds={this.props.getDiscoverBirds} />
          </div>
          <div className="col-md-8">
            <TweetList loadTweets={this.props.loadTweets} />
          </div>
        </div>
      </div>
    );
    // ENDSTUB
  }
}


// hint hint ;)
const mapDispatchToProps = dispatch => ({
  loadTweets: () => dispatch(loadTweets()),
  getDiscoverBirds: () => dispatch(getDiscoverBirds()),
});

export default connect(null, mapDispatchToProps)(NewsFeed);
