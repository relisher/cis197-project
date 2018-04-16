import React, { Component } from 'react';
import TweetList from './TweetList';
import ProfileBox from './ProfileBox';
import CreateTweetBox from './CreateTweetBox';
import { loadTweetsForProfile } from '../actions/tweetActions';
import { getUser, favUnfav } from '../actions/profileActions';
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: the component should have  a ProfileBox  and TweetList component, if
    // an id is specified in the url (you can check this by looking at
    // this.props.match.params.id then render out a CreateTweetBox else dont
    // the ProfileBox should have the props `id` corresponding  to this.props.match.params.id
    // `user` corresponding to a  function that will dispatch the getUser async function with
    // appropriate arguments
    // `favUnfav` corresponding to a function that  will dispatch the favUnfav async function with
    // appropriate arguments
    // the TweetList should have a single property `loadTweets` equal  to a function that will
    // dispatch the loadTweets async function with appropriate arguments (in this case the
    // current user id which you can grab from this.props.match.params.id
    //
    // html structure
    // <div class="container">
    //  <h2>Profile</h2>
    //  <div class="row">
    //    <div class="col-md-4">
    //      ... profile box
    //    </div>
    //    <div class="col-md-8">
    //      ... optionally a create tweet box
    //      ...  tweet list
    //    </div>
    //  </div>
    // </div>

    // STUB
    let { match } = this.props;
    let createTweetBox = match.params.id ? '' : <CreateTweetBox />;
    return (
      <div className="container">
        <h2>Profile</h2>
        <div className="row">
          <div className="col-md-4">
            <ProfileBox
              id={match.params.id}
              user={() => this.props.user(match.params.id)}
              favUnfav={() => this.props.favUnfav(match.params.id)}
            />
          </div>
          <div className="col-md-8">
            { createTweetBox }
            <TweetList
              loadTweets={() => this.props.loadTweets(match.params.id)}
            />
          </div>
        </div>
      </div>
    );
    // ENDSTUB
  }
}

const mapDispatchToProps = dispatch =>
  // optionally use this to handle assigning dispatch actions to props
  // STUB
  ({
    user: id => dispatch(getUser(id)),
    favUnfav: id => dispatch(favUnfav(id)),
    loadTweets: id => dispatch(loadTweetsForProfile(id)),
  });
  // ENDSTUB


export default connect(null, mapDispatchToProps)(Profile);
