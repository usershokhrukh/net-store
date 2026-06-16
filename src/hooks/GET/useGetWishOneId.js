import { useQuery } from "@tanstack/react-query"
import axios from "axios";

export const useGetWishOneId = (productId) => {
  return useQuery({
    queryKey: ["wish", productId[0], productId[1]],
    queryFn: async ({queryKey}) => {      
      const [, productId, userId] = queryKey;
      const res = await axios.get(`http://localhost:4000/wish?productId=${productId}&userId=${userId}`)
      return res?.data
    }
  })
}