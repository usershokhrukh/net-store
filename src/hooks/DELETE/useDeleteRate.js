import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const useDeleteRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) =>{
      const res = await axios.delete(`http://localhost:4000/rate/${id}`)
      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rate"]})
    }
  })
}