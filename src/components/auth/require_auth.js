import React, { Component } from 'react';
import { connect } from 'react-redux';
import hello from 'hellojs';
import axios from 'axios';
import { browserHistory } from 'react-router';

import { fetch_notification_list } from '../../actions';

import Alert from 'react-s-alert';
// mandatory
import 'react-s-alert/dist/s-alert-default.css';


const ROOT_URL = 'http://localhost:80';


export default function (ComposedComponent) {



  var online = function (session) {
    var currentTime = (new Date()).getTime() / 1000;
    return session && session.access_token && session.expires > currentTime;
  };

  class Authentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    constructor(props) {
      super(props);

      this.state = { EmailState: this.props.ProfEmail, NameState: this.props.ProfName };

    }

    componentWillMount() {

      var gl = hello('google').getAuthResponse();


      var fb = hello('facebook').getAuthResponse();



      if (!online(gl) && !online(fb)) {

        if(this.props.ProfEmail == undefined && this.props.ProfEmail == "") {
          this.context.router.push('/');
        }
       
      }


      if (!this.props.authenticated) {
        if(this.props.ProfEmail == undefined && this.props.ProfEmail == "") {
        this.context.router.push('/');
        }
      }


      //username 체크하는 코드
      /* Username 사용하지 않음.
        axios.get(`${ROOT_URL}/checkUsername`, {
  
          params: {
            email: this.state.EmailState
          }
        }).then(function (response) {
          //username 만든적이 있는지 체크하고,
          if (!response.data) {
            //로그인한 상태라면!
            if(online(gl) || online(fb)){
              browserHistory.push('/a2/username');
            }
          } 
  
        })
        .catch(function (error) {
            console.log(error);
          });
  */



      //username 체크하는 코드


      axios.get(`${ROOT_URL}/checkUserLevel`, {



        params: {
          email: this.state.EmailState,
          name: this.state.NameState

        }
      }).then(function (response) {
        //user level 먼저 check하고.
        if (!response.data) {
          //로그인 한 상태라면!
          if (online(gl) || online(fb)) {
            browserHistory.push('/a2/userBlockedAlert');
          }
        }


      })
        .catch(function (error) {

        });

    }


    componentWillUpdate(nextProps) {

      var gl = hello('google').getAuthResponse();
      var fb = hello('facebook').getAuthResponse();

      if (!online(gl) && !online(fb)) {
        localStorage.setItem('RequiredAuthStat', false);
        if(this.props.ProfEmail == undefined && this.props.ProfEmail == "") {
        this.context.router.push('/');
        }
      }

      if (!nextProps.authenticated) {
        if(this.props.ProfEmail == undefined && this.props.ProfEmail == "") {
        this.context.router.push('/');
        }
      }

    }

    render() {

      return (
          <ComposedComponent {...this.props} />
      );
    }
  }

  function mapStateToProps(state) {

    return {
      authenticated: state.auth.authenticated,

      ProfEmail: state.profile_email.email,
      ProfName: state.profile_name.name
    };
  }

  return connect(mapStateToProps)(Authentication);
}
