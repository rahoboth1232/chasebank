import { useQuery } from "@tanstack/react-query";
import { fetchCdAccounts } from "../api/cdAccountsApi";

export const useCdAccounts = () => {
  return useQuery({
    queryKey: ["cdAccounts"],
    queryFn: fetchCdAccounts
  });
};