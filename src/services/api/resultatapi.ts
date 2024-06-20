import axios from "axios";
import axiosInstance from "../utils";
import { API_URL } from "@/settings";
import { Resultat } from "@/interfaces/interfaces";

const API_URL_RESULTATER = `${API_URL}/resultater`;

export const getResultater = async () => {
    return axios.get(API_URL_RESULTATER);
}

export const getResultaterByDisciplin = async (disciplinId: number, køn?: string, minAlder?: number, maxAlder?: number) => {
    const params = new URLSearchParams();
    if (køn) params.append('køn', køn);
    if (minAlder !== undefined) params.append('minAlder', minAlder.toString());
    if (maxAlder !== undefined) params.append('maxAlder', maxAlder.toString());
  
    const response = await axiosInstance.get(`/resultater/disciplin/${disciplinId}`, { params });
    return response.data;
  };

export const createResultat = async (resultat: Resultat) => {
    return axios.post(API_URL_RESULTATER, resultat);
}

export const createResultater = async (resultater: Resultat[]) => {
    return axios.post(API_URL_RESULTATER, resultater);
}

export const updateResultat = async (id: number, resultat: Resultat) => {
    return axios.put(`${API_URL_RESULTATER}/${id}`, resultat);
}

export const deleteResultat = async (id: number) => {
    return axios.delete(`${API_URL_RESULTATER}/${id}`);
}