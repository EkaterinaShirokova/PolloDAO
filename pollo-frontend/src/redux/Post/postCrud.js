import axios from "axios";
import { BASE_URL } from "../config"
import { makeTokenHeader } from '../../utils';

export const SINGLEPOST_URL = BASE_URL + "api/post-info/";
export const ALLPOST_URL = BASE_URL + "api/post-info-all";
export const POSTWITHADDRESS_URL = BASE_URL + "api/post-info-by-address/";
export const POSTINFO_URL = BASE_URL + "api/post-info/";
export const NEWPOST_URL = BASE_URL + "api/new-post/";
export const UPDATEPOST_URL = BASE_URL + "api/update-post";
export const DELETE_URL = BASE_URL + "api/delete-post";
export const FILE = BASE_URL  + "api/file/";
export const SEARCH = BASE_URL  + "api//post-info-all?keyword="
export const LIKE = BASE_URL + "api/like-post"
export const FILEPRE = BASE_URL + "api/attachment-preview/"

export function getPostByAddress(address) {
  return axios.get(POSTWITHADDRESS_URL + address);
}

export function searchPost(query) {
  return axios.get(SEARCH + query);
}

export function filePreview(id) {
  return axios.get(FILEPRE + id);
}

export function downloadFile(address) {
  return axios.get(FILE + address,{
    responseType: 'blob',
  });
}

export function getPostById(id) {
  return axios.get(POSTINFO_URL + id);
}
export function likePost(token, id, userId, liked) {
  return axios.put(LIKE ,{id, userId, liked} ,makeTokenHeader(token));
}


export function createnewpost( token , dataForm) {
  return axios.post(NEWPOST_URL, dataForm , makeTokenHeader(token));
}

export function updatepost( token , id ,address, title , body ) {
    return axios.put(UPDATEPOST_URL, { id ,address, title , body } , makeTokenHeader(token));
}

export async function  deletepost (token , id ,address ) {
  return await axios.delete(DELETE_URL, { 
    headers: {
      Authorization: `Bearer ${token}`
    },
    data:{
      id: id,
      address: address
    }
  });
}

export function getallpost() {
    return axios.get(ALLPOST_URL);
}
export function getallpostByPageNumber(count, size) {
  return axios.get(ALLPOST_URL + "?" + "page=" +count + "&page_size=" + size);
}


