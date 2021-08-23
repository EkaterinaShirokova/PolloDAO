import axios from "axios";
import { BASE_URL } from "../config"
import { makeTokenHeader } from '../../utils';

export const NOTIFICATION_URL = BASE_URL + "api/notifications/";
export const READ_NOTIFICATION_URL = BASE_URL + "api/read-notification/";
export const READ_ALL_NOTIFICATION_URL = BASE_URL + "api/clear-notification/";

export function postNotification(token, userId, title, link, from ) {
  return axios.post(NOTIFICATION_URL, { userId, title, link, from }, makeTokenHeader(token));
}

export function getNotificationByUserId(token, userId) {
  return axios.get(NOTIFICATION_URL + userId , makeTokenHeader(token) );
}

export function readNotificationByIndex(userId, index) {
  return axios.put(READ_NOTIFICATION_URL + userId + "/" + index) ;
}

export function markAsAllNotifications(token, userId) {
  return axios.put(READ_ALL_NOTIFICATION_URL + userId , {}, makeTokenHeader(token) );
}
