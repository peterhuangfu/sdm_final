import { GET_NOTIFY, SET_NOTIFY, USER_READ } from '../actions/constant'

const initialState = {
  ifNewComing: false,
  notifies: []
}

export default function auth(state = initialState, action) {
  switch(action.type) {
    case GET_NOTIFY:
      if (action.notify !== 'No notification') {
        return {
          isNewComing: true,
          notifies: [...state.notifies, action.notify]
        }
      }
      else {
        return {
          ...state
        }
      }
    case SET_NOTIFY:
      return {
        ...state,
        notifies: action.notify === null ? [] : action.notify
      }
    case USER_READ:
      return {
        ...state,
        isNewComing: false
      }
    default: 
      return state
  }
}
