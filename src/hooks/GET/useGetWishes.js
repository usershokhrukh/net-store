import { useQueries, useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetWishes = () => {
  return useQuery({
    queryKey: ["wish"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/wish")
      return res?.data
    }
  })
}