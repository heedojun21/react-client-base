import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './header';
import hello from 'hellojs'
import { browserHistory } from 'react-router';

import { bindActionCreators } from 'redux';

import {  } from '../actions/index';

class App extends Component {

  constructor(props) {

    var online = function (session) {
      var currentTime = (new Date()).getTime() / 1000;
      return session && session.access_token && session.expires > currentTime;
    };

    var gl = hello('google').getAuthResponse();
    var fb = hello('facebook').getAuthResponse();


    var RequiredAuthTokenBool = localStorage.getItem('RequiredAuthStat');



    if (!online(gl) && !online(fb)) {

      if(RequiredAuthTokenBool == "false"){
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
      }
    
    }


    var authBool;

    if (online(gl) || online(fb)) {
      authBool = true;
    } else {
      if(RequiredAuthTokenBool == "true"){
        authBool = true;
      } else {
        authBool = false;
      }
    }


    super(props)
    this.state = { authState: authBool, userInfoState: undefined };

  }


  componentDidMount(){

  }

  componentWillReceiveProps(nextProps){

  }

  render() {
    return (

      <div>

        <Header authPropFromApp={this.state.authState}  />
        
        {this.props.children}

      </div>

    );
  }
}



function mapStateToProps(state) {
  
  // Whatever is returned will show up as props
  // inside of BookList
  return {
     
  };
}

// Anything returned from this function will end up as props
// on the BookList container
function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({  }, dispatch);
}

// Promote BookList from a component to a container - it needs to know
// about this new dispatch method, selectBook. Make it available
// as a prop.
export default connect(mapStateToProps, mapDispatchToProps)(App);
