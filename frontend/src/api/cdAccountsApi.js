import { api } from "./axiosInstance";

export const fetchCdAccounts = async () =>{
    const {data} = await api.get("api/cds/")
    return data
};