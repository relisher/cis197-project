import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tweet from './Tweet';

class TweetList extends Component {
  componentDidMount() {
    // TODO: load the tweets and set up an interval
    // that loads the tweets again every 2500 ms
    // Think about how you'd be able to load tweets
    // without doing additional imports...
    // STUB
    this.props.loadTweets();
    let i = setInterval(() => {
      this.props.loadTweets();
    }, 2500);
    this.setState({
      interval: i,
    });
    // ENDSTUB
  }

  componentWillUnmount() {
    // TODO: when the component is about to unmount
    // clear the interval (the one running every 2500 ms
    // ie stop  the refreshing)
    // STUB
    clearInterval(this.state.interval);
    this.setState({
      interval: null,
    });
    // ENDSTUB
  }

  render() {
    // TODO: render out your  tweets (use the Tweet component with
    // appropriate arguments `id` to represent  the tweetId and
    // a key for react
    // ultimate html should look like
    // <div class="col-md-12">
    //  ...bunch o tweets
    // </div>
    // STUB
    let tweets = this.props.ids.map((t, idx) => (
      <Tweet
        id={t}
        key={idx}
      />));
    return (
      <div className="col-md-12">
        { tweets }
      </div>
    );
    // ENDSTUB
  }
}

const mapStateToProps = state => state.tweetList;


export default connect(
  mapStateToProps,
  null
)(TweetList);
