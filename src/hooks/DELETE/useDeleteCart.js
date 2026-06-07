import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const useDeleteCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`http://localhost:4000/cart/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["cart"]})
    }
  })
}