import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer, fetchTransferData } from "../api/TransferApi";


export const useTransferData = () => {
  return useQuery({
    queryKey: ["transfer"],
    queryFn: fetchTransferData
  });
};

export const useCreateTransfer = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,

    onSuccess: () => {
      queryClient.invalidateQueries(["transfer"]);
    }
  });
};