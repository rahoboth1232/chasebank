import { api } from "./axiosInstance";

export const fetchProfile = async () =>{
    const {data} = await api.get("profile/")
    return data
};



export const updateProfile = async (data) => {
  const res = await api.patch("profile/update/", data);
  return res.data;
};