import axios from "axios";
import { API_URL } from "../../settings";
//import { Disciplin } from "../../interfaces/interfaces";

const API_URL_DISCIPLINER = `${API_URL}/discipliner`;

export const getDiscipliner = async () => {
    return axios.get(API_URL_DISCIPLINER);
}