import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetCart = (userId) => {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: async ({queryKey}) => {
      const [, id] = queryKey;      
      const res = await axios.get(`http://localhost:4000/cart?userId=${id}`)
      return res.data
    }
  })
}