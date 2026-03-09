import { useQuery } from "@tanstack/react-query";
import { fetchDocuments } from "../api/DocumentViewApi";

export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments
  });
};