import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, select, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import axios from 'axios';

import { setUsername, checkUsernameAvailabilityAsync } from '../../actions/index';
import { Link } from 'react-router';
import hello from 'hellojs';

import { Button } from 'react-bootstrap';


const ROOT_URL = 'http://localhost:80';

const sleep = miliSeconds => new Promise((resolve, reject) => setTimeout(resolve, miliSeconds))

const asyncValidate = (values /*, dispatch */) => {

  //sleep 안하고 밑에 바로 new Promise로 해도 됨.
  return sleep(1000).then(() => {
    // simulate server latency

    return new Promise((resolve, reject) => {
      axios.get(`${ROOT_URL}/checkUsernameAvailabilityAsync`, {
        params: {
          username: values.username
        }
      }).then(
        (res) => { if (res.data == true) { resolve(res) } else { reject({ username: 'Please, try another username' }) } },
        (err) => reject({ username: 'Please, try another username' })
        );
    })

  })
}

class SetUsername extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = { EmailState: this.props.email, NameState: this.props.name };

  }

  componentDidMount() {

    const prof = this.getProfile();
    this.setState({ EmailState: prof.email, NameState: prof.name });

  }


  getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  onSubmit(props) {

    props.Email = this.state.EmailState;
    props.Name = this.state.NameState;

    this.props.setUsername(props);

  }


  renderInputField(field) {
    const { meta: { asyncValidating, touched, error } } = field;
 
    return (
      <div className="one-field">
        <label className="question" >{field.label}</label>

          <input
           className="input-box"
            type="text"
            {...field.input}
          />
          {touched && error && <span>{error}</span>}

      </div>
    );
  }


  render() {
    const { handleSubmit, reset, submitting } = this.props;

    return (
      <div className="content">
        <nav className="sidebar">

          <ul className="side-nav">
            {/* 이거 빈 채로 있어야 footer가 바닥에 붙어 있음. */}
          </ul>

          <div className="legal">
            &copy; 2018 by Bufollow. Web design credit to Jonas Schmedtmann. All rights reserved.
              </div>
        </nav>


        <main className="sass-main">

          <h1 className="heading-primary" >Username</h1>

          <form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="form-sass">
            <div className="form-box">

              <Field
                label="Create your username: "
                name="username"
                component={this.renderInputField}
              />


              <div className="form-button">

                <input type="submit" value="Send" disabled={this.state.errorState || submitting }
                  onClick={this._addNotification}
                  className="submit-button sass-btn sass-btn--red sass-btn--animated" />

              </div>

            </div> {/* form-box div end */}


          </form>

        </main >

      </div >
    );
  }
}




function validate(values) {
  // console.log(values) -> { title: 'asdf', categories: 'asdf', content: 'asdf' }
  const errors = {};

  // Validate the inputs from 'values'
  if (!values.username) {
    errors.username = "Required";
  }

  if (values.username != undefined) {
    if (values.username.length < 4) {
      errors.username = "Must be more than 4 characters."
    }
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
}


function mapStateToProps(state) {
  return {
    ProfEmail: state.profile_email,
    ProfName: state.profile_name,
    UserNameResultProp: state.setUsernameResultReducer
  };
}



// connect: first argument is mapStateToProps, 2nd is mapDispatchToProps
// reduxForm: 1st is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps


export default reduxForm({
  validate,
  asyncValidate,
  asyncBlurFields: ['username'],
  shouldAsyncValidate: ({ syncValidationPasses, trigger }) => {
    if (!syncValidationPasses) return false;
    return trigger !== 'submit';
  },
  form: 'SetUsername'
})(
  connect(mapStateToProps, { setUsername, checkUsernameAvailabilityAsync })(SetUsername)
  );

