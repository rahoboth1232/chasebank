import { api } from "./axiosInstance";

export const fetchTransaction = async () =>{
    const {data} = await api.get("activity/")
    return data
};