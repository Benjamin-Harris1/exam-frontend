import axios from "axios";
import axiosInstance from "../utils";
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

export const getFilteredDeltagere = async (
  køn?: string,
  minAlder?: number,
  maxAlder?: number,
  klub?: string,
  disciplin?: string
) => {
  const params = new URLSearchParams();
  if (køn) params.append('køn', køn);
  if (minAlder !== undefined) params.append('minAlder', minAlder.toString());
  if (maxAlder !== undefined) params.append('maxAlder', maxAlder.toString());
  if (klub) params.append('klub', klub);
  if (disciplin) params.append('disciplin', disciplin);

  const response = await axiosInstance.get(`${API_URL_DELTAGER}/filter`, { params });
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