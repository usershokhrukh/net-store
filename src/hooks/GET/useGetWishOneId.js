import { useQuery } from "@tanstack/react-query"
import axios from "axios";

export const useGetWishOneId = (productId) => {
  return useQuery({
    queryKey: ["wish", productId],
    queryFn: async ({queryKey}) => {
      const [, productId] = queryKey;
      const res = await axios.get(`http://localhost:4000/wish?productId=${productId}`)
      return res?.data
    }
  })
}