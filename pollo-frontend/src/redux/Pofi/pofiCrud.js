import axios from "axios";
import { BASE_URL } from "../config"
import { makeTokenHeader } from '../../utils';

export const BALANCE = BASE_URL + "api/balance/";
export const CREATE_PROPOSAL = BASE_URL + "api/create-proposal";
export const FINISH_PROPOSAL = BASE_URL + "api/finish-proposal";
export const CAST_VOTE = BASE_URL + "api/cast-vote";

export function getBalance(token, address) {
    // Authorization head should be fulfilled in interceptor.
    return axios.get(BALANCE + address, makeTokenHeader(token));
  }

export function createProposalPoFi(token, title, options, owner) {
  return axios.post(CREATE_PROPOSAL, { title, options, owner }, makeTokenHeader(token));
}

export function finishProposalPoFi(token, address) {
  return axios.post(FINISH_PROPOSAL, { address }, makeTokenHeader(token));
}

export function castVotePoFi(token, address, userAddress, vote) {
  return axios.post(CAST_VOTE, { address, userAddress, vote }, makeTokenHeader(token));
}