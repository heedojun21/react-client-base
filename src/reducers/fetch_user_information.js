import _ from 'lodash';
import { FETCH_USER_INFORMATION } from '../actions/index';

export default function(state = {}, action) {
  switch (action.type) {
  case FETCH_USER_INFORMATION:  

    return { userInformation : action.payload.data };

  default:
    return state;
  }
}



