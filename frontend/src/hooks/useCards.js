import { useQuery } from "@tanstack/react-query";

import { fetchCards } from "../api/useCardApi";

export const useCards = () => {
  return useQuery({
    queryKey: ["card"],
    queryFn: fetchCards,
  });
};