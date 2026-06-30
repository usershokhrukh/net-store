import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const usePostUserOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = axios.post(`http://localhost:4000/orders`, payload)
      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["order"]})
    }
  })
}