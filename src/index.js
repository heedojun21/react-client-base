import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import { AUTH_USER } from './actions/types';
import { UNAUTH_USER } from './actions/types';

import promise from 'redux-promise';

import routes from './routes';

import Async from './components/middlewares/async'

//calendar css 
import 'react-widgets/dist/css/react-widgets.css'

export const EmailReducer = 'LoggedInForEmail';
export const NameReducer = 'LoggedInForName';

import hello  from 'hellojs';


const createStoreWithMiddleware = applyMiddleware(Async,reduxThunk,promise)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');


// If we have a token, consider the user to be signed in
if (token) {
    const prof = getProfile();

    // we need to update application state
    store.dispatch({ type: AUTH_USER });
    store.dispatch( {type: EmailReducer, payload: prof.email});
    store.dispatch( {type: NameReducer, payload: prof.name});
}

function  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
  , document.querySelector('.container'));

