import { API_CALL_ERROR } from '../actions/constant'

const initialState = {
  errors: {}
}

export default function board(state = initialState, action) {
  switch(action.type) {
    case API_CALL_ERROR:
      return {
        errors: action.errors
      }
    default: 
      return state
  }
}
