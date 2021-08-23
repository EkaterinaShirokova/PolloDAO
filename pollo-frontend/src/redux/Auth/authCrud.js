import axios from "axios";
import { BASE_URL } from "../config"
import { makeTokenHeader } from '../../utils';

export const ME_URL = BASE_URL + "api/user-info/";
export const LOGIN_URL = BASE_URL + "api/login";
export const LOGOUT_URL = BASE_URL + "api/logout";
export const SIGNUP_URL = BASE_URL + "api/new-user";
export const UPDATE_URL = BASE_URL + "api/update-user";
export const ALLUSER_URL = BASE_URL + "api/all-users";
export const RESTRICTED = BASE_URL + "api/filter-users";

export function getalluser() {
  return axios.get(ALLUSER_URL);
}

export function restrictedUsers() {
  return axios.get(RESTRICTED);
}

export function getUserByAddress(token, address) {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL + address, makeTokenHeader(token));
}

export function login(address) {
  return axios.post(LOGIN_URL, { address });
}

export function logout(token, address) {
  return axios.post(LOGOUT_URL, { address }, makeTokenHeader(token));
}

export function signup(address, userId, userHandle, userRole,userDesc, avatar) {
  return axios.post(SIGNUP_URL, { address, userId, userHandle, userRole,userDesc, avatar });
}

export function updateUserInfo(token, address, userId, userHandle, userRole,userDesc, avatar) {
  return axios.put(UPDATE_URL, { address, userId, userHandle, userRole,userDesc, avatar }, makeTokenHeader(token))
}
export function updateUserInfoByLeader(token, address, userId, userHandle, userRole,userDesc, banLevel) {
  return axios.put(UPDATE_URL, { address, userId, userHandle, userRole,userDesc, banLevel }, makeTokenHeader(token))
}