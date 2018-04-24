import React, { Component } from 'react';
import TweetList from './TweetList';
import { loadTweetsForProfile } from '../actions/tweetActions';
import { connect } from 'react-redux';
import { Widget, addResponseMessage, addUserMessage} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
let messagesLoaded = false;

class ProfileBox extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getChats(this.props.id);
    this.props.user();
  }

  render() {
    let chatButton = this.props.id ?
     (<div>
     <Widget
       handleNewUserMessage={this.props.chat}
       title={this.props.profile.name}
       subtitle=""
    />
    </div>) : '';
    let button = this.props.id ?
      (
        <button className="btn btn-primary" onClick={this.props.favUnfav}>
          { this.props.profile.isFollowing === true ? 'Unfollow' : 'Follow' }
        </button>
      ) : '';
    let followersLength = this.props.profile.followers ? this.props.profile.followers.length : 0;
    let followingLength = this.props.profile.following ? this.props.profile.following.length : 0;
    if(!messagesLoaded) {
      for(var msg in this.props.messageList) {
        messagesLoaded = true;
        if(this.props.messageList[msg].author == this.props.id) {
          console.log("reached");
          addUserMessage(this.props.messageList[msg].message);
        } else {
          if(this.props.messageList[msg].message) {
            addResponseMessage(this.props.messageList[msg].message);
          }
        }
      }
    }
    return (
      <div className="card">
        <img className="card-img-top" src={this.props.profile.image} style={{ height: '200px' }} />
        <div className="card-body">
          <div className="card-title">
            { this.props.profile.name }
          </div>
          <p className="text-muted">
            { this.props.profile.species }
          </p>
          <br /> Followers:
          { followersLength }
          <br /> Following:
          { followingLength }
          <br />
          { button }
          <br />
          { chatButton }
          <br />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profileReducer.profile,
  messageList: state.profileReducer.profile.messageHistory,
});

export default connect(mapStateToProps, null)(ProfileBox);
