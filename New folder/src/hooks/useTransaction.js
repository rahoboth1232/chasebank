import { useQuery } from "@tanstack/react-query";
import { fetchTransaction } from "../api/Transaction";


export const useTransaction = () => {
  return useQuery({
    queryKey: ["transaction"],
    queryFn: fetchTransaction
  });
};