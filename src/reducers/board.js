import { GET_ALL_BOARD, GET_BOARD_INFO, GET_ALL_POST, GET_POST_DETAIL, NEW_POST, NEW_COMMENT, NEW_CITATION, EDIT_POST, EDIT_COMMENT, DEL_POST, DEL_COMMENT, DEL_CITATION, LIKE_POST, LIKE_COMMENT } from '../actions/constant'

const initialState = {
  all_boards: [],
  current_board: {
    info: {},
    posts: []
  },
  current_post: []
}

export default function board(state = initialState, action) {
  switch(action.type) {
    case GET_ALL_BOARD:
      return {
        ...state,
        all_boards: action.boards
      }
    case GET_BOARD_INFO:
      return {
        ...state,
        current_board: {
          ...state.current_board,
          info: action.board_info
        }
      }
    case GET_ALL_POST:
      return {
        ...state,
        current_board: {
          ...state.current_board,
          posts: action.posts !== null ? action.posts.filter(e => e.floor === 1) : []
        }
      }
    case GET_POST_DETAIL:
      return {
        ...state,
        current_post: action.posts
      }
    case NEW_POST:
      return {
        ...state
      }
    case NEW_COMMENT:
      return {
        ...state
      }
    case NEW_CITATION:
      return {
        ...state
      }
    case EDIT_POST:
      return {
        ...state
      }
    case EDIT_COMMENT:
      return {
        ...state
      }
    case DEL_POST:
      return {
        ...state
      }
    case DEL_COMMENT:
      return {
        ...state
      }
    case DEL_CITATION:
      return {
        ...state
      }
    case LIKE_POST:
      return {
        ...state
      }
    case LIKE_COMMENT:
      return {
        ...state
      }
    default: 
      return state
  }
}
