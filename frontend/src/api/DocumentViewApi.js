
import { api } from "./axiosInstance";

export const fetchDocuments = async () =>{
    const {data} = await api.get("legal_documents/")
    return data
};