import { SET_CURRENT_USER, CHECK_LOGIN_STATUS, USER_LOGOUT, API_CALL_ERROR, GET_SELF_USER_INFO, GET_USER_INFO, MODIFY_USER_INFO } from './constant'
import agent from './agent'

export const userLogout = (history) => dispatch => {
  dispatch({
    type: USER_LOGOUT
  })
  localStorage.removeItem('user_id')
  history.push('/')
}

export const getSelfUserInfo = (user_id) => dispatch => {
  agent.post('/GetUserInfo', { userId: user_id })
  .then(res => {
    dispatch({
      type: GET_SELF_USER_INFO,
      user: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const getUserInfo = (user_id) => dispatch => {
  agent.post('/GetUserInfo', { userId: user_id })
  .then(res => {
    dispatch({
      type: GET_USER_INFO,
      user: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const modifyUserInfo = (user_info) => dispatch => {
  agent.post('/EditUserInfo', user_info)
  .then(res => {
    dispatch({
      type: MODIFY_USER_INFO,
      message: res.data.message
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}
