import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import hello  from 'hellojs';

function logout(network){
    hello( network ).logout(function(e){
        //log("logout",e);
    });
    hello.on('auth.logout', function () {
        localStorage.removeItem('token');
    });
}



class Signout extends Component {
  componentWillMount() {
     logout();
    this.props.signoutUser();

  }

  render() {
    return <div>Sorry to see you go...</div>;
  }
}

export default connect(null, actions)(Signout);
