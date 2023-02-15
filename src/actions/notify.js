import { GET_NOTIFY, SET_NOTIFY, USER_READ, API_CALL_ERROR } from './constant'
import agent from './agent'

export const getNotify = (user_id) => dispatch => {
  agent.post('/GetNotification', { userId: user_id })
  .then(res => {
    dispatch({
      type: GET_NOTIFY,
      notify: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const setNotify = (notifies) => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: SET_NOTIFY,
      notify: notifies
    })
    resolve()
  })
}

export const userRead = (user_info) => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: USER_READ
    })
    resolve()
  })
}
