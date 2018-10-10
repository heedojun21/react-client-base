import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import hello from 'hellojs';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { loginUserGoogle, loginUserFacebook, logoutUser } from '../../actions/index';

import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';


// Local version start

const GOOGLE_CLIENT_ID  = "304194010781-koviaofmp32k5ki6pkp68kmgefdce5ms.apps.googleusercontent.com";
const FACEBOOK_CLIENT_ID  = "767418310090789";


hello.init({
    google: GOOGLE_CLIENT_ID,
    facebook: FACEBOOK_CLIENT_ID
}, {
    redirect_uri: 'http://127.0.0.1:8080/'
});

// Local version end

//Production version start
/*
const GOOGLE_CLIENT_ID = "304194010781-tvpni4umnj09e8ea67fo98fclsp2huds.apps.googleusercontent.com";
//const FACEBOOK_CLIENT_ID  = "1427827697329994";  //bufollow.com facebook.
const FACEBOOK_CLIENT_ID = "424998071231957";   //www.bufollow.com facebook.

hello.init({
    google: GOOGLE_CLIENT_ID,
    facebook: FACEBOOK_CLIENT_ID
}, {
        // redirect_uri: 'http://bufollow.com/'
        redirect_uri: 'http://www.bufollow.com/'
    });
*/
//Production version end

hello('google').api('me').then(function (response) {
    //   alert('Your name is ' + response.name + ' and your email is ' + response.email);
}, function (e) {
    //   alert('Whoops! ' + e.error.message);
})

var online = function (session) {
    var currentTime = (new Date()).getTime() / 1000;
    return session && session.access_token && session.expires > currentTime;
};


class OAuthSign extends Component {

    constructor(props) {
        super(props)

        //state이 바뀌면 새로 rendering되니, logInState를 Header,와 app에서 변경되어 오는 것을 추가해두기. 
        //  this.state= {logInState : this.props.authPropFromHeader};



        this.state = {
            logInState: this.props.authPropFromHeader,
            EmailState: props.EmailProp, NameState: props.ProfName
        };

        this.logOutFunction = this.logOutFunction.bind(this);

    }

    logOutFunction() {

        this.props.logoutUser();
        this.props.action();

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.authenticated == false) {
            localStorage.removeItem('token');
            localStorage.removeItem('profile');
        }
    }

    googleLogIn = () => {

        this.props.loginUserGoogle().then(function (response) {
            location.reload();
        });
    }

    facebookLogIn = () => {
        this.props.loginUserFacebook().then(function (response) {
            location.reload();
        });
    }

    emailLogin = () => {
        browserHistory.push('/emailSignUp');
    }


    renderLinks() {

        var gl = hello('google').getAuthResponse();
        var fc = hello('facebook').getAuthResponse();

        let onlineStatBool = false;

        if (online(gl) || online(fc)) {
            onlineStatBool = true;
        } else {

            if(this.state.EmailState != "" && this.state.EmailState != undefined ){
                onlineStatBool = true;
            }
        }

        if (onlineStatBool) {

            return (
                <div className="user-nav dropdown-content right-nav-logged-in" >
                    <a className="dropdown-content__loggedIn" href="http://www.bufollow.info" target="_blank" >
                        <svg className="right-nav__icon" >
                            <use xlinkHref="../style/img/bufollow_icons.svg#icon-info"></use>
                        </svg>
                        Tutorial
                        </a>
                    <a className="dropdown-content__loggedIn" href="/userInformation">
                        <svg className="right-nav__icon" >
                            <use xlinkHref="../style/img/bufollow_icons.svg#icon-cog"></use>
                        </svg>
                        Setting
                        </a>
                    <a className="dropdown-content__loggedIn" href="/sendFeedback">
                        <svg className="right-nav__icon" >
                            <use xlinkHref="../style/img/bufollow_icons.svg#icon-envelop"></use>
                        </svg>
                        Feedback
                        </a>
                    <a className="dropdown-content__loggedIn" href="/" onClick={this.logOutFunction}>
                        <svg className="right-nav__icon" >
                            <use xlinkHref="../style/img/bufollow_icons.svg#icon-exit"></use>
                        </svg>
                        Sign out
                    </a>
                </div>
            );
        } else {

            return (
                <div className="user-nav dropdown-content right-nav-logged-out">
                    <a className="dropdown-content__loggedOut" onClick={this.googleLogIn}>
                        <svg className="user-nav__icon google_icon" >
                            <use xlinkHref="../style/img/bufollow_icons.svg#icon-google2"></use>
                        </svg>
                    </a>
                    <a className="dropdown-content__loggedOut" onClick={this.facebookLogIn}>
                        <svg className="user-nav__icon facebook_icon" >
                            <use xlinkHref="../style/img/bufollow_icons.svg#icon-facebook2"></use>
                        </svg>
                    </a>
                </div>
            );
        }

    }


    render() {

        return (
            this.renderLinks()

        );

    }

}




function mapStateToProps(state) {
    // Whatever is returned will show up as props
    // inside of BookList
    return {
        authenticated: state.auth.authenticated,
      //  NotificationListProps: state.notificationListReducer
    };
}

// Anything returned from this function will end up as props
// on the BookList container
function mapDispatchToProps(dispatch) {
    // Whenever selectBook is called, the result shoudl be passed
    // to all of our reducers
    return bindActionCreators({ loginUserGoogle: loginUserGoogle, loginUserFacebook: loginUserFacebook, logoutUser: logoutUser }, dispatch);
}

// Promote BookList from a component to a container - it needs to know
// about this new dispatch method, selectBook. Make it available
// as a prop.
export default connect(mapStateToProps, mapDispatchToProps)(OAuthSign);
