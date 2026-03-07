import { api } from "./axiosInstance";
 
export  const createTransfer = async (data) => {
  const res = await api.post("/api/transfer/", data);
  return res.data;
};


export  const fetchTransferData = async () => {
  const res = await api.get("/api/transfer/");
  return res.data;
};