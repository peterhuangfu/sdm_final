import {
  GET_ALL_VOTE,
  GET_VOTE_DETAIL,
  NEW_VOTE,
  VOTE,
  API_CALL_ERROR,
} from "../actions/constant";
import agent from "./agent";

export const getVote = () => (dispatch) => {
  agent
    .post("/GetVote", {})
    .then((res) => {
      dispatch({
        type: GET_ALL_VOTE,
        all_votes: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: API_CALL_ERROR,
        errors: err,
      });
    });
};

export const getVoteDetail = (vote_id) => (dispatch) => {
  agent
    .post("/GetVoteDetail", { voteId: vote_id })
    .then((res) => {
      dispatch({
        type: GET_VOTE_DETAIL,
        current_vote: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: API_CALL_ERROR,
        errors: err,
      });
    });
};

export const newVote = (vote) => (dispatch) => {
  agent
    .post("/LaunchVote", vote)
    .then((res) => {
      dispatch({
        type: NEW_VOTE,
        message: res.data.message,
      });
    })
    .catch((err) => {
      dispatch({
        type: API_CALL_ERROR,
        errors: err,
      });
    });
};

export const Vote = (info) => (dispatch) => {
  agent
    .post("/Vote", info)
    .then((res) => {
      dispatch({
        type: VOTE,
        message: res.data.message,
      });
    })
    .catch((err) => {
      dispatch({
        type: API_CALL_ERROR,
        errors: err,
      });
    });
};
