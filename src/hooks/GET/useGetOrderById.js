import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetOrderById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async ({queryKey}) => {
      const [,id] = queryKey
      const res = await axios.get(`http://localhost:4000/orders/${id}`)
      return res?.data
    }
  })
}