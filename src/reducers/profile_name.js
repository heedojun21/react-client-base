// State argument is not application state, only the state
// this reducer is responsible for
export default function(state = {}, action) {
  switch(action.type) {
  case 'LoggedInForName':
    return {...state, name: action.payload};
  case 'LoggedOutForName':
    return  {...state, name: action.payload};
  }

  return state;
}
