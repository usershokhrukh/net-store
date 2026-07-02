import { useQuery } from "@tanstack/react-query"
import axios from "axios";

export const useGetOrderByUser = (userId) => {
  return useQuery({
    queryKey: ["rate", userId],
    queryFn: async ({queryKey}) => {
      const [,userId] = queryKey;
      const res = await axios.get(`http://localhost:4000/rate?userId=${userId}`)
      return res?.data
    }
  })
}