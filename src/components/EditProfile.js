import React, { Component } from 'react';
import { updateProfile } from '../actions/profileActions';
import { connect } from 'react-redux';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    let data = {
      name: this.refs.name.value,
      species: this.refs.species.value,
      photo: this.refs.photo.value,
    };
    // TODO: make a call to update the profile
    // STUB
    this.props.updateProfile(data);
    // ENDSTUB
  }

  render() {
    return (
      <div className="container">
        <h2>Update Info:</h2>
        <form onSubmit={this.submitForm}>
          <div className="form-group">
            <label>
              Name:
            </label>
            <input
              className="form-control"
              type="text"
              ref="name"
            />
          </div>
          <div className="form-group">
            <label>
              Species:
            </label>
            <input
              className="form-control"
              type="text"
              ref="species"
            />
          </div>
          <div className="form-group">
            <label>
              Image:
            </label>
            <input
              className="form-control"
              type="text"
              ref="photo"
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-primary"
              value="Make Edits"
            />
          </div>
        </form>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch =>

  // set up a call to the updateProfile async action creator
  // ie just do the regular mapDispatchToProps type of
  // pattern for dispatching updateProfile
  // STUB
  ({
    updateProfile: data => dispatch(updateProfile(data)),
  });
  // ENDSTUB

export default connect(null, mapDispatchToProps)(EditProfile);
