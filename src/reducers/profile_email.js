// State argument is not application state, only the state
// this reducer is responsible for
export default function(state = {}, action) {

  switch(action.type) {
  case 'LoggedInForEmail':

    return {...state, email: action.payload};

  case 'LoggedOutForEmail':
    return {...state, email: action.payload};
  }

  return state;
}
