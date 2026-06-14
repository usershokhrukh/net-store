import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const usePutWish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.put(`http://localhost:4000/wish/${payload[0]}`, payload[1])
      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["wish"]})
    }
  })
}