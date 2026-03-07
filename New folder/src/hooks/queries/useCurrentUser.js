import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../api/authApi";

export const useCurrentUser = () => {

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    retry: false
  });

};