import { GET_ALL_BOARD, GET_BOARD_INFO, GET_ALL_POST, GET_POST_DETAIL, NEW_POST, NEW_COMMENT, NEW_CITATION, EDIT_POST, EDIT_COMMENT, DEL_POST, DEL_COMMENT, DEL_CITATION, LIKE_POST, LIKE_COMMENT, API_CALL_ERROR } from '../actions/constant'
import agent from './agent'

export const getAllBoard = (domain) => dispatch => {
  agent.post('/GetAllBoards', { domainName: domain })
  .then(res => {
    dispatch({
      type: GET_ALL_BOARD,
      boards: res.data === null ? [] : res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const getBoardInfo = (board_id) => dispatch => {
  agent.post('/GetBoardById', { boardId: board_id })
  .then(res => {
    dispatch({
      type: GET_BOARD_INFO,
      board_info: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const getAllPosts = (board_id) => dispatch => {
  agent.post('/GetAllPosts', { boardId: board_id })
  .then(res => {
    dispatch({
      type: GET_ALL_POST,
      posts: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const getPostDetail = (post_id) => dispatch => {
  agent.post('/GetPostDetail', { postId: post_id, floor: -1 })
  .then(res => {
    dispatch({
      type: GET_POST_DETAIL,
      posts: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const newPost = (post) => dispatch => {
  agent.post('/Post', post)
  .then(res => {
    dispatch({
      type: NEW_POST,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const newComment = (comment) => dispatch => {
  agent.post('/PostComment', comment)
  .then(res => {
    dispatch({
      type: NEW_COMMENT,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const newCitation = (citation) => dispatch => {
  agent.post('/MakeCitation', citation)
  .then(res => {
    dispatch({
      type: NEW_CITATION,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const editPost = (post) => dispatch => {
  agent.post('/EditPost', post)
  .then(res => {
    dispatch({
      type: EDIT_POST,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const editComment = (comment) => dispatch => {
  agent.post('/EditComment', comment)
  .then(res => {
    dispatch({
      type: EDIT_COMMENT,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const delCitation = (citation) => dispatch => {
  agent.post('/DeleteCitation', citation)
  .then(res => {
    dispatch({
      type: DEL_CITATION,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const delPost = (post) => dispatch => {
  agent.post('/DeletePost', post)
  .then(res => {
    dispatch({
      type: DEL_POST,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const delComment = (comment) => dispatch => {
  agent.post('/DeleteComment', comment)
  .then(res => {
    dispatch({
      type: DEL_COMMENT,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const likePost = (info) => dispatch => {
  agent.post('/LikePost', info)
  .then(res => {
    dispatch({
      type: LIKE_POST,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}

export const likeComment = (info) => dispatch => {
  agent.post('/LikeComment', info)
  .then(res => {
    dispatch({
      type: LIKE_COMMENT,
      message: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: API_CALL_ERROR,
      errors: err
    })
  })
}
