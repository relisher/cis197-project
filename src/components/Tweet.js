import React, { Component } from 'react';
import { connect } from 'react-redux';
import { favoriteTweet } from '../actions/tweetActions';
import { Link } from 'react-router-dom';

class Tweet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { tweetId, authorName, authorId, authorPic, content, isFavorited, numFavorites } = this.props;
    let cardStyles = {
      marginBottom: '40px',
      padding: '10px',
    };
    let favoriteStyles = {
      color: '#FFF',
    };
    let imgStyles = {
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      marginRight: '10px',
    };
    let authorUrl = `/profile/${authorId}`;
    let image = authorPic ? authorPic : 'https://files.allaboutbirds.net/wp-content/uploads/2015/06/prow-featured.jpg';
    let favoriteText = (isFavorited ? 'Unfavorite' : 'Favorite') + ' tweet';
    return (
      <div className="card" style={cardStyles}>
        <h5 className="card-title">
          <img src={image} style={imgStyles} />
          <Link to={authorUrl}> { authorName } </Link>
        </h5>
        <p>
          { content }
        </p>
        <a
          onClick={() => this.props.favoriteTweet(tweetId)}
          style={favoriteStyles}
          className="btn btn-primary"
        >
          { favoriteText }
        </a>
        <span>This tweet has been favorited { numFavorites } time(s)</span>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  // TODO: set up a prop `favoriteTweet` dispatchings the favoriteTweet acition with the id
  // of the tweet (as an argument to this function
  // STUB
  ({
    favoriteTweet: id => dispatch(favoriteTweet(id)),
  });
  // ENDSTUB


const mapStateToProps = (state, ownProps) =>
  // TODO: setup this function so that you're rendering the correct  tweet
  // ie looking at your state and just mapping the correct props onto
  // this component
  // STUB
  state.tweet[ownProps.id];
  // ENDSTUB


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tweet);
