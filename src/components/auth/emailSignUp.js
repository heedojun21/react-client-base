import React, { Component, PropTypes } from 'react';

import { Field, reduxForm, select, SubmissionError } from 'redux-form';

import axios from 'axios';



import { Link } from 'react-router';
import { connect } from 'react-redux';
import { postImage } from '../../actions/index';
import hello from 'hellojs';

import { browserHistory } from 'react-router';

import * as actions from '../../actions';

import Alert from 'react-s-alert';
// mandatory
import 'react-s-alert/dist/s-alert-default.css';

import NotificationSystem from 'react-notification-system';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert'; // Import 
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css 


const ROOT_URL = 'http://localhost:80';


//const sleep = miliSeconds => new Promise((resolve, reject) => setTimeout(resolve, miliSeconds))

const asyncValidate = (values /*, dispatch */) => {

  //sleep 안하고 밑에 바로 new Promise로 해도 됨.
 // return sleep(1000).then(() => {
    // simulate server latency

    return new Promise((resolve, reject) => {

      axios.get(`${ROOT_URL}/checkEmailAlreadyExist`, {
        params: {
          email: values.emailforsignup
        }
      }).then(

        (res) => { if (res.data == true) { resolve(res) } else { reject({ emailforsignup: 'This email is already exist.' }) } },
        (err) => reject({ emailforsignup: 'This email is already exist.' })
        );

    })

  //})
}



class EmailSignUp extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {AuthFailed: false, ErrorMessage: ''};

    }



    componentDidMount() {
        this.props.change('hidden', "LOGIN");

        if(this.props.ProfEmail != undefined && this.props.ProfEmail != ""){
            browserHistory.push('/');
        }
    }

    componentWillReceiveProps(nextProps){


        if(nextProps.logInResultBoolProp == true){
            this.setState({AuthFailed: true, ErrorMessage: "Authentication failed. please, try again."});
        }
    }


    renderEmailInputField = (field) => {
        const { meta: { touched, error } } = field;

        return (
            <div className="one-field">
                <label className="question" >{field.label}</label>

                <input
                    className="input-box"
                    type="email"
                    placeholder={field.placeholder}
                    {...field.input}
                />
                {touched && error && <span>{error}</span>}

            </div>
        );
    }

    renderInputField = (field) => {
        const { meta: { touched, error } } = field;

        return (
            <div className="one-field">
                <label className="question" >{field.label}</label>

                <input
                    className="input-box"
                    type="text"
                    placeholder={field.placeholder}
                    {...field.input}
                />
                {touched && error && <span>{error}</span>}

            </div>
        );
    }


    renderPasswordInputField = (field) => {
        const { meta: { touched, error } } = field;

        return (
            <div className="one-field">
                <label className="question" >{field.label}</label>

                <input
                    className="input-box"
                    type="password"
                    placeholder={field.placeholder}
                    {...field.input}
                />
                {touched && error && <span>{error}</span>}

            </div>
        );
    }


    renderHiddenField = (field) => {
        const { meta: { touched, error } } = field;

        return (

            <input
                className="input-box"
                type="hidden"
                {...field.input}
            />
        );
    }


    LogInClicked = () => {
        this.props.change('hidden', "LOGIN");

    }

    SignUpClicked = () => {
        this.props.change('hidden', "SIGNUP");

    }



    onSubmit = (props) => {


        if (props.hidden == "SIGNUP") {
        
              this.props.signUpUsingEmail(props);
        } else {
          
              this.props.logInUsingEmail(props);
        }


    }

    render() {
        const { handleSubmit, touched, error, submitFailed, submitting, pristine } = this.props;



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


                    <Tabs>
                        <TabList>
                            <Tab onClick={() => this.LogInClicked()}>Log in</Tab>
                            <Tab onClick={() => this.SignUpClicked()}>Sign up</Tab>
                        </TabList>

                        <TabPanel >
                            <h1 className="heading-primary" style={{ backgroundColor: "#faf9f9" }} >Log in:</h1>
                            <p style={{ backgroundColor: "#faf9f9", marginLeft: "35px" }} > *test email (test@bufollow.com) password (test) </p>
                            <form onSubmit={handleSubmit(this.onSubmit.bind(this))} encType="multipart/form-data" className="form-sass">
                                <div className="form-box">

                                    {(submitFailed) && error && <span>Please, input the required fields.</span>}

                                    {this.state.AuthFailed == true && this.state.ErrorMessage != '' ? <span style={{color: 'red'}}>{this.state.ErrorMessage}</span> : undefined}

                                    <Field
                                        label="Email*:"
                                        name="emailforlogin"
                                        component={this.renderEmailInputField}
                                    />

                                    <Field
                                        label="Password*: "
                                        name="password"
                                        component={this.renderPasswordInputField}
                                    />

                                    <div className="form-button">
                                        <Link to="/" className="cancel-button sass-btn sass-btn--white sass-btn--animated">Cancel</Link>
                                        <input type="submit" value="Log in" disabled={submitting || pristine}
                                            onClick={this._addNotification}
                                            className="submit-button sass-btn sass-btn--red sass-btn--animated" />

                                    </div>

                                </div> {/* form-box div end */}




                            </form>

                        </TabPanel>

                        <TabPanel>
                            <h1 className="heading-primary" style={{ backgroundColor: "#faf9f9" }} >Sign up:</h1>
                            <form onSubmit={handleSubmit(this.onSubmit.bind(this))} encType="multipart/form-data" className="form-sass">
                                <div className="form-box">

                                    {(submitFailed) && error && <span>Please, input the required fields.</span>}

                                    <Field
                                        label="Email*:"
                                        name="emailforsignup"
                                        component={this.renderEmailInputField}
                                    />

                                    <Field
                                        label="Name*:"
                                        name="name"
                                        component={this.renderInputField}
                                    />

                                    <Field
                                        label="Password*: "
                                        name="password"
                                        component={this.renderPasswordInputField}
                                    />

                                    <Field
                                        label="Password confirmation*: "
                                        name="passwordConfirm"
                                        component={this.renderPasswordInputField}
                                    />



                                    <Field
                                        label="Hidden:"
                                        name="hidden"
                                        component={this.renderHiddenField}
                                    />

                                    <div className="form-button">
                                        <Link to="/" className="cancel-button sass-btn sass-btn--white sass-btn--animated">Cancel</Link>
                                        <input type="submit" value="Sign up" disabled={submitting || pristine}
                                            onClick={this._addNotification}
                                            className="submit-button sass-btn sass-btn--red sass-btn--animated" />

                                    </div>

                                </div> {/* form-box div end */}




                            </form>

                        </TabPanel>

                    </Tabs>





                    <NotificationSystem ref="notificationSystem" />
                    <Alert stack={{ limit: 1 }} />


                </main >

            </div >
        );
    }
}




function validate(values, props) {
    const errors = {};


    if (!values.emailforsignup) {
        errors.emailforsignup = "Required";

    }

    if (!values.emailforlogin) {
        errors.emailforlogin = "Required";

    }


    if (values.hidden == "SIGNUP") {
        if (!values.name) {
            errors.name = "Required";

        }

      
        if (values.password !== values.passwordConfirm) {
            errors.passwordConfirm = 'Passwords must match';
        }
        

    }


    if (!values.password) {
        errors.password = "Required";

    }



    // If errors is empty, the form is fine to submit
    // If errors has *any* properties, redux form assumes form is invalid

    return errors;
}





function mapStateToProps(state) {


    return {
        logInResultBoolProp: state.logInUsingEmailBoolReducer,
        ProfEmail: state.profile_email.email,
    };
}



// connect: first argument is mapStateToProps, 2nd is mapDispatchToProps
// reduxForm: 1st is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps



export default reduxForm({
    validate,
    asyncValidate,
    asyncBlurFields: ['emailforsignup'],
    shouldAsyncValidate: ({ syncValidationPasses, trigger }) => {
      if (!syncValidationPasses) return false;
      return trigger !== 'submit';
    },
    form: 'emailSignUp'
  })(
    connect(mapStateToProps, actions)(EmailSignUp)
    );
  
  


