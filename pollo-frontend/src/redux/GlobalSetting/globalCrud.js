import axios from "axios";
import { BASE_URL } from "../config"
import { makeTokenHeader } from '../../utils';

export const GLOBAL_SETTINGS = BASE_URL + "api/global-setting";



export function getGlobalSettings(token) {
  return axios.get(GLOBAL_SETTINGS, makeTokenHeader(token));
}

export function updateGlobalSettings(loginRequirement, proposalRequirement, userId, token) {
  return axios.post(GLOBAL_SETTINGS,{loginRequirement, proposalRequirement, userId}, makeTokenHeader(token));
}
