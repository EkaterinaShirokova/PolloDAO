import axios from "axios";
import { BASE_URL } from "../config"
import { makeTokenHeader } from '../../utils'

export const Endpoint = BASE_URL + "api/proposal";

//interface IOption {
//    label: string;
//    voterIds: string[];
//    description: string;
//}


//interface IProposal {
//    id: number;
//    createdBy: string;
//    dateCreated: Date;
//    dateApproved: Date;
//    description: string;
//    status: number;
//    options: Array<IOption>;
//    deadline: Date;
//    allowAnonymous: boolean;
//}

const dataSource = [
    {
        id: 1, createdBy: '5f4d234', dateCreated: '2021-26-5', dateApproved: '2021-26-5', description: 'Proposal description here',
        status: 1, options: [{ label: 'optA', voterIds: ['5f4d234', '5f4d235'] }, { label: 'optB', voterIds: ['5f4d235'] }],
    },
    {
        id: 2, createdBy: '5f4d235', dateCreated: '2021-25-5', dateApproved: '2021-25-5', description: 'Proposal description here',
        status: 1, options: [{ label: 'optA', voterIds: ['5f4d234', '5f4d235'] }],
    },
    {
        id: 3, createdBy: '5f4d234', dateCreated: '2021-24-5', dateApproved: '2021-24-5', description: 'Proposal description here',
        status: 1, options: [{ label: 'optA', voterIds: ['5f4d234', '5f4d235'] }, { label: 'optA', voterIds: ['5f4d234'] }],
    },
    {
        id: 4, createdBy: '5f4d235', dateCreated: '2021-23-5', dateApproved: '2021-23-5', description: 'Proposal description here',
        status: 0, options: [{ label: 'optA', voterIds: ['5f4d234', '5f4d235'] }],
    }
];

export function getAllProposals() {
    return axios.get(Endpoint);
    // return dataSource;
}

export function getProposal(id) {
    return axios.get(`${Endpoint}/${id}`);
    // return dataSource.find(f => f.id === id);
}

export function createProposal(token, proposal) {
    return axios.post(Endpoint, proposal, makeTokenHeader(token));
}

export function updateProposal(token, id, proposal) {
    return axios.put(`${Endpoint}/${id}`, proposal, makeTokenHeader(token));
}

export function activateProposal(token, id, contract) {
    return axios.patch(`${Endpoint}/${id}/activate`, {contract}, makeTokenHeader(token));
}

export function updateEndDate(token, id, endDate) {
    return axios.patch(`${Endpoint}/${id}/enddate`, { endDate }, makeTokenHeader(token));
}

export function downloadFile(address) {
    return axios.get(`${Endpoint}/file/` + address,{
      responseType: 'blob',
    });
}

export function deleteProposal(token, id) {
    return axios.post(`${Endpoint}/${id}`, {}, makeTokenHeader(token));
}

export function finishVote(token, id, proposal){
    return axios.patch(`${Endpoint}/${id}/finish`, proposal, makeTokenHeader(token));
}

export function vote(token, id, optionLabel, userId){
    return axios.patch(`${Endpoint}/${id}/vote`, {optionLabel: optionLabel, userId: userId}, makeTokenHeader(token));
}
