import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import profileEmail from './profile_email';
import profileName from './profile_name';
import fetch_user_information from './fetch_user_information';



const rootReducer = combineReducers({
  form,
  auth: authReducer,
  profile_email: profileEmail,
  profile_name: profileName,
 

});

export default rootReducer;


