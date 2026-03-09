
import { api } from "./axiosInstance";

export const fetchCards = async () =>{
    const {data} = await api.get("api/cds/")
    return data
};