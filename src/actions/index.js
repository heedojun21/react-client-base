import axios from 'axios';
import { browserHistory } from 'react-router';

import _ from 'lodash';

import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE

} from './types';


import hello from 'hellojs';

const ROOT_URL = 'http://localhost:80';



function getProfile() {
  // Retrieves the profile data from localStorage
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(localStorage.profile) : {}
}



export function loginUserGoogle() {
  return function (dispatch) {


    hello('google').login({ display: 'popup', scope: 'profile, email', response_type: 'token' }).then(function (response) {

      dispatch({ type: AUTH_USER });

    }, function (e) {
      //alert('Signin error: ' + e.error.message);


    });


    hello.on('auth.login', function (auth) {

      localStorage.setItem('token', auth.authResponse.access_token);


      // Call user information, for the given network
      hello(auth.network).api('me').then(function (r) {


        dispatch({
          type: 'LoggedInForEmail',
          payload: r.email
        });

        dispatch({
          type: 'LoggedInForName',
          payload: r.name
        });




        localStorage.setItem('profile', JSON.stringify(r));


        localStorage.setItem('RequiredAuthStat', "true");

        location.reload(); // This changes svg user icon . 

        if(FromShareableInspiration != undefined && FromShareableInspiration != "" && FromShareableInspiration != null){
          browserHistory.push(`/${FromShareableInspiration}`);
        } else {
          browserHistory.push('/');
        }

  

      });
    });
  }
}



export function loginUserFacebook() {
  return function (dispatch) {

    var FromShareableInspiration = localStorage.getItem('inspiration_id');


    hello('facebook').login({ display: 'popup', scope: 'email, public_profile', response_type: 'token' }).then(function (response) {


      //Get the notification information
      //   dispatch(fetch_notification_list(props.email));

      dispatch({ type: AUTH_USER });


    }, function (e) {

      //alert('Signin error: ' + e.error.message);
    });


    hello.on('auth.login', function (auth) {

      localStorage.setItem('token', auth.authResponse.access_token);




      // Call user information, for the given network
      hello(auth.network).api('me').then(function (r) {


        //Check and generate notification list
        axios.get(`${ROOT_URL}/generateNotification`, {

          params: {
            //email: this.state.EmailState
            email: r.email
          }
        }).then(function (response) {

          //Get the notification information 
          dispatch(fetchNotificationList(r.email));
        }).catch(function (error) {

        });;



        //fetch priority goal for this user
        axios.get(`${ROOT_URL}/fetchPriorityDoGoal`, {
          params: {
            //email: this.state.EmailState
            email: r.email
          }
        }).then(function (response) {
          localStorage.setItem('priority_do_goal', response.data);

        }).catch(function (error) {

        });;



        //fetch priority goal for this user
        axios.get(`${ROOT_URL}/fetchPriorityNoGoal`, {
          params: {
            //email: this.state.EmailState
            email: r.email
          }
        }).then(function (response) {
          localStorage.setItem('priority_no_goal', response.data);

        }).catch(function (error) {

        });;


        dispatch({
          type: 'LoggedInForEmail',
          payload: r.email
        });
        dispatch({
          type: 'LoggedInForName',
          payload: r.name
        });

        localStorage.setItem('profile', JSON.stringify(r));

        localStorage.setItem('RequiredAuthStat', "true");
        location.reload();  // This changes svg user icon . 

        if(FromShareableInspiration != undefined && FromShareableInspiration != "" && FromShareableInspiration != null){
          browserHistory.push(`/${FromShareableInspiration}`);
        } else {
          browserHistory.push('/');
        }

    
      });
    });
  }
}

export const SIGN_UP_USING_EMAIL = 'SIGN_UP_USING_EMAIL';

export function signUpUsingEmail(props) {
  return function (dispatch) {

    var config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    var FromShareableInspiration = localStorage.getItem('inspiration_id');




    const request = axios.get(`${ROOT_URL}/signUpUsingEmail`, {
      params: {
        email: props.emailforsignup,
        name: props.name,
        password: props.password
      }
    }).then((response) => {


      var createdStruct = {
        'displayName': props.name,
        'email': props.emailforsignup,
        'emails': [{ 'value': props.email, 'type': 'account' }],
        'name': props.name,
        'objectType': 'person'
      }

      localStorage.setItem('token', "anything is possible");


      localStorage.setItem('profile', JSON.stringify(createdStruct));


      localStorage.setItem('RequiredAuthStat', "true");



      dispatch({
        type: 'LoggedInForEmail',
        payload: props.emailforsignup
      });
      dispatch({
        type: 'LoggedInForName',
        payload: props.name
      });

      location.reload(); // This changes svg user icon . 


      if(FromShareableInspiration != undefined && FromShareableInspiration != "" && FromShareableInspiration != null){
        browserHistory.push(`/${FromShareableInspiration}`);
      } else {
        browserHistory.push('/SetDoGoal');
      }
    
      //setTimeout(function () { browserHistory.push('/SetDoGoal'); }, 1000);
    });


    return {
      type: SIGN_UP_USING_EMAIL,
      payload: request
    };
  }

}



export const LOG_IN_USING_EMAIL = 'LOG_IN_USING_EMAIL';

export function logInUsingEmail(props) {
  return function (dispatch) {

    var config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    var FromShareableInspiration = localStorage.getItem('inspiration_id');

    const request = axios.get(`${ROOT_URL}/logInUsingEmail`, {
      params: {
        email: props.emailforlogin,
        password: props.password
      }
    }).then((response) => {


      var createdStruct = {
        'displayName': response.data,
        'email': props.emailforlogin,
        'emails': [{ 'value': props.email, 'type': 'account' }],
        'name': response.data,
        'objectType': 'person'
      }



      if (response.data == "Authenticated Fail") {

        dispatch({
          type: LOG_IN_USING_EMAIL,
          payload: response.data  //true means there is an error in this case.
        });




        setTimeout(function () { browserHistory.push('/emailSignUp'); }, 1000);
      } else {

        dispatch({
          type: LOG_IN_USING_EMAIL,
          payload: response.data  //true means there is an error in this case.
        });

        dispatch({
          type: 'LoggedInForEmail',
          payload: props.emailforsignup
        });
        dispatch({
          type: 'LoggedInForName',
          payload: props.name
        });



        //fetch priority goal for this user
        axios.get(`${ROOT_URL}/fetchPriorityDoGoal`, {
          params: {
            //email: this.state.EmailState
            email: props.emailforlogin
          }
        }).then(function (response) {
          localStorage.setItem('priority_do_goal', response.data);

        }).catch(function (error) {

        });;



        //fetch priority goal for this user
        axios.get(`${ROOT_URL}/fetchPriorityNoGoal`, {
          params: {
            //email: this.state.EmailState
            email: props.emailforlogin
          }
        }).then(function (response) {
          localStorage.setItem('priority_no_goal', response.data);

        }).catch(function (error) {

        });;


        localStorage.setItem('token', "anything is possible");

        localStorage.setItem('profile', JSON.stringify(createdStruct));

        localStorage.setItem('RequiredAuthStat', "true");


        location.reload(); // This changes svg user icon . 

        if(FromShareableInspiration != undefined && FromShareableInspiration != "" && FromShareableInspiration != null){
          browserHistory.push(`/${FromShareableInspiration}`);
        } else {
          browserHistory.push('/');
        }


      
        // setTimeout(function () { browserHistory.push('/'); }, 1000);
      }
      // 
    });


    return {
      type: LOG_IN_USING_EMAIL,
      payload: request // false means there is not error.
    };
  }

}




export function logoutUser() {

  hello('google').logout().then(function () {
    dispatch({
      type: 'LoggedOutForEmail',
      payload: ''
    });
    dispatch({
      type: 'LoggedOutForName',
      payload: ''
    });

  }, function (e) {
    //   alert('Sign out error: ' + e.error.message);
  });

  hello('facebook').logout().then(function () {
    dispatch({
      type: 'LoggedOutForEmail',
      payload: ''
    });
    dispatch({
      type: 'LoggedOutForName',
      payload: ''
    });

  }, function (e) {
    //   alert('Sign out error: ' + e.error.message);
  });

  hello.on('auth.logout', function () {

    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.setItem('RequiredAuthStat', "false");

    localStorage.removeItem('priority_no_goal');
    localStorage.removeItem('priority_do_goal');

    //location.reload(); // This changes svg user icon . 
    //browserHistory.push('/');

  });

  localStorage.removeItem('token');
  localStorage.removeItem('profile');
  localStorage.setItem('RequiredAuthStat', "false");
  localStorage.removeItem('priority_no_goal');
  localStorage.removeItem('priority_do_goal');

  location.reload(); // This changes svg user icon . 
  browserHistory.push('/');
  //   localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}






export const FETCH_USER_INFORMATION = 'FETCH_USER_INFORMATION';

export function fetch_userInformation() {

  const prof = getProfile();

  const request = axios.get(`${ROOT_URL}/fetch_userInformation`, {
    params: {
      email: prof.email
    }
  });

  return {
    type: FETCH_USER_INFORMATION,
    payload: request
  };

}





export const EDIT_USER_INFORMATION = 'EDIT_USER_INFORMATION';

export function editUserInfo(props) {
  return function (dispatch) {


    var config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    // const request = axios.post(`${ROOT_URL}/setDoGoalJSON`, props, config);
    const request = axios.post(`${ROOT_URL}/editUserInfoJSON`, props).then((response) => {
      //call another action using dispatch method                                    
      browserHistory.push('/userInformation');
      dispatch(fetch_userInformation());
    });
    return {
      type: EDIT_USER_INFORMATION,
      payload: request
    };
  }

}





















export const FETCH_NOTIFICATION_LIST = 'FETCH_NOTIFICATION_LIST';

export function fetchNotificationList(emailPS) {


  const request = axios.get(`${ROOT_URL}/fetchNotificationList`, {
    params: {
      email: emailPS
    }
  });



  return {
    type: FETCH_NOTIFICATION_LIST,
    payload: request
  };

}



export const NOTIFICATION_READ = 'NOTIFICATION_READ';

export function notificationRead(notification_idPS) {

  const prof = getProfile();

  const request = axios.get(`${ROOT_URL}/notificationRead`, {
    params: {
      email: prof.email,
      notification_id: notification_idPS
    }
  });

  return {
    type: NOTIFICATION_READ,
    payload: request
  };

}





















export const EDIT_PASSWORD_RESULT = 'EDIT_PASSWORD_RESULT';

export function editPassword(props) {
  return function (dispatch) {


    const request = axios.get(`${ROOT_URL}/editPassword`, {
      params: {
        email: props.email,
        old_password: props.old_password,
        new_password: props.new_password
      }
    }).then((response) => {


      if (response.data == "Password Edit Failed") {

        dispatch({
          type: EDIT_PASSWORD_RESULT,
          payload: response.data  //true means there is an error in this case.
        });

        setTimeout(function () { browserHistory.push('/editPassword'); }, 1000);
      } else {

        dispatch({
          type: EDIT_PASSWORD_RESULT,
          payload: response.data  //true means there is an error in this case.
        });


        setTimeout(function () { browserHistory.push('/userInformation'); }, 1000);
      }
      // 
    });


    return {
      type: EDIT_PASSWORD_RESULT,
      payload: request // false means there is not error.
    };
  }

}



