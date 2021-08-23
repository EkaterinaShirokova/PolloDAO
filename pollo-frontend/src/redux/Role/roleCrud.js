import axios from "axios";
import { BASE_URL } from "../config"
import { makeTokenHeader } from '../../utils';

export const ROLE = BASE_URL + "api/new-role";
export const ALL = BASE_URL + "api/role-info-all/"


export function getALLRoles() {
  return axios.get(ALL);
}


export function newRole(token, role, userId, userHandle, address) {
  return axios.post(ROLE, { role, userId, userHandle, address }, makeTokenHeader(token));
}

