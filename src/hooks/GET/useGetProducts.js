import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/products")
      return res.data
    }
  })
}