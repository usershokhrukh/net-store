import { useQuery } from "@tanstack/react-query"
import axios from "axios";

export const useGetCategoryByUser = (payload) => {
  return useQuery({
    queryKey: ["cart", payload[0], payload[1]],
    queryFn: async ({queryKey}) => {
      const [, userId, categoryId] = queryKey;
      const res = await axios.get(`http://localhost:4000/cart?userId=${userId}&categoryId=${categoryId}`)
      
      return res?.data
    }
  })
}