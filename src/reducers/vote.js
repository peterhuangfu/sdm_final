import { GET_ALL_VOTE, GET_VOTE_DETAIL, NEW_VOTE, VOTE } from '../actions/constant'

const initialState = {
  all_votes: [],
  current_vote: {}
}

export default function vote(state = initialState, action) {
  switch(action.type) {
    case GET_ALL_VOTE:
      return {
        ...state,
        all_votes: action.all_votes
      }
    case GET_VOTE_DETAIL:
      return {
        ...state,
        current_vote: action.current_vote
      }
    case NEW_VOTE:
      return {
        ...state
      }
    case VOTE:
      return {
        ...state
      }
    default: 
      return state
  }
}
