import { useQuery } from "@tanstack/react-query"
import axios from "axios";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/user");
      return res.data
    }
  });
}