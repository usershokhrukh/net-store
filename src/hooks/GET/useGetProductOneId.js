import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetProductOneId =  (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async ({queryKey}) => {
      const [, id] = queryKey;
      const res = await axios.get(`http://localhost:4000/products?productId=${id}`)
      return res.data
    }
  })
}