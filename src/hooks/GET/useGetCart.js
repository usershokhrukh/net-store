import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/cart")
      return res.data
    }
  })
}