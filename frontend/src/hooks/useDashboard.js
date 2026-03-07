import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../api/DasboardApi";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard
  });
};