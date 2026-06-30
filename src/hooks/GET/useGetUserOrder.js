import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetUserOrder = (userId) => {
  return useQuery({
    queryKey: ["order", userId],
    queryFn: async ({queryKey}) => {
      const [,id]= queryKey
      const res = await axios.get(`http://localhost:4000/orders?userId=${id}`)
      return res?.data
    }
  })
}