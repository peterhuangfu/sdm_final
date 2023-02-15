import { SET_CURRENT_USER, CHECK_LOGIN_STATUS, USER_LOGOUT, GET_SELF_USER_INFO, GET_USER_INFO, MODIFY_USER_INFO } from '../actions/constant'

const initialState = {
  isAuthenticated: false,
  user: {
    info: {},
    publish_post: [],
    replied_post: []
  },
  another_user: {
    info: {},
    publish_post: [],
    replied_post: []
  }
}

export default function auth(state = initialState, action) {
  switch(action.type) {
    case USER_LOGOUT:
      return {
        isAuthenticated: false,
        user: {
          info: {},
          publish_post: [],
          replied_post: []
        },
        another_user: {
          info: {},
          publish_post: [],
          replied_post: []
        }
      }
    case GET_SELF_USER_INFO:
      const user = {
        info: action.user,
        publish_post: action.user.publishPost != null ? action.user.publishPost.filter(post => post.floor === 1) : [],
        replied_post: action.user.publishPost != null ? action.user.publishPost.filter(post => post.floor !== 1) : []
      }
      
      return {
        ...state,
        isAuthenticated: true,
        user: user
      }
    case GET_USER_INFO:
      const another_user = {
        info: action.user,
        publish_post: action.user.publishPost != null ? action.user.publishPost.filter(post => post.floor === 1) : [],
        replied_post: action.user.publishPost != null ? action.user.publishPost.filter(post => post.floor !== 1) : []
      }

      return {
        ...state,
        another_user: another_user
      }
    case MODIFY_USER_INFO:
      return {
        ...state
      }
    default: 
      return state
  }
}
