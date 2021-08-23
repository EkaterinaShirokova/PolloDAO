import axios from "axios";
import { BASE_URL } from "../config";
import { makeTokenHeader } from '../../utils';

export const POST_COMMENT = BASE_URL + "api/new-comment";
export const GET_INFO = BASE_URL + "api/comment-info/"
export const LIKE_COMMENT = BASE_URL + "api/like-comment"


export function createComment(token, post_id,text, address , commented_by, created , modified) {
  return axios.post(POST_COMMENT, { post_id,text, address , commented_by, created , modified}, makeTokenHeader(token));
}
export function getComment(id) {
  return axios.get(GET_INFO + id);
}

export function likeComment(token, id, userId, liked){
  return axios.put(LIKE_COMMENT ,{id, userId, liked} ,makeTokenHeader(token));
}
