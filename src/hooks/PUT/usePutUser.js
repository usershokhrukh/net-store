import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const usePutUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {      
      const res  = await axios.put(`http://localhost:4000/user`, payload);
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["user"]})
    }
  })
}