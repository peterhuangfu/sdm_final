import { combineReducers } from 'redux'
import auth from './auth'
import board from './board'
import vote from './vote'
import notify from './notify'
import error from './error'

export default combineReducers({
  auth: auth,
  board: board,
  vote: vote,
  notify: notify,
  error: error
})
