import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/ProfileApi";


export const useUpdateProfile = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    }
  });

};