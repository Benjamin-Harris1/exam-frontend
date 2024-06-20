import axios from "axios";
import { API_URL } from "../../settings";
import { Deltager } from "../../interfaces/interfaces";

const API_URL_DELTAGER = `${API_URL}/deltager`;

export const getDeltagere = async () => {
  return axios.get(API_URL_DELTAGER);
};

export const getDeltagereById = async (id: number) => {
  return axios.get(`${API_URL_DELTAGER}/${id}`);
};

export const getDeltagerByName = async (name: string) => {
  const response = await axios.get(`${API_URL_DELTAGER}/name/${name}`);
  return response.data; 
};
 
export const createDeltager = async (deltager: Deltager) => {
  return axios.post(API_URL_DELTAGER, deltager);
};

export const updateDeltager = async (id: number, deltager: Deltager) => {
  return axios.put(`${API_URL_DELTAGER}/${id}`, deltager);
};

export const deleteDeltager = async (id: number) => {
  return axios.delete(`${API_URL_DELTAGER}/${id}`);
};