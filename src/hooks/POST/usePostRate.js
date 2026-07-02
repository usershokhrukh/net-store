import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const usePostRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(`http://localhost:4000/rate`, payload)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rate"]})
    }
  })
}