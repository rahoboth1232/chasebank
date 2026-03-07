import { api } from "./axiosInstance";



export const loginUser = async (credentials) => {
  const { data } = await api.post("api/login/", credentials);
  return data;
};