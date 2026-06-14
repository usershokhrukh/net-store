import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const usePutCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      console.log(payload[1]);
      
      const res = await axios.put(`http://localhost:4000/cart/${payload[0]}`, payload[1])
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["cart"]})
    }
  })
}