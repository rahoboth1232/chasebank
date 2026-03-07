import { api } from "./axiosInstance";

export const fetchDashboard = async () =>{
    const {data} = await api.get("dashboard/")
    return data
};