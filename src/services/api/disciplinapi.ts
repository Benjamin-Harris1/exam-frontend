import axios from "axios";
import { API_URL } from "../../settings";
import { Disciplin } from "../../interfaces/interfaces";

const API_URL_DISCIPLINER = `${API_URL}/discipliner`;

export const getDiscipliner = async () => {
    return axios.get(API_URL_DISCIPLINER);
}

export const createDisciplin = async (disciplin: Disciplin) => {
    return axios.post(API_URL_DISCIPLINER, disciplin);
}

export const updateDisciplin = async (id: number, disciplin: Disciplin) => {
    return axios.put(`${API_URL_DISCIPLINER}/${id}`, disciplin);
}

export const deleteDisciplin = async (id: number) => {
    return axios.delete(`${API_URL_DISCIPLINER}/${id}`);
}