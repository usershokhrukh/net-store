import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const usePutCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.put(`http://localhost:4000/cart/${payload.id}`, payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["cart"]})
    }
  })
}