import { useQueries, useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetWishes = (userId) => {
  return useQuery({
    queryKey: ["wish", userId],
    queryFn: async ({queryKey}) => {
      const [, id] = queryKey;      
      const res = await axios.get(`http://localhost:4000/wish?userId=${id}`)
      return res?.data
    }
  })
}