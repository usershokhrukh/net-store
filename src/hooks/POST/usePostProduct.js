import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export const usePostProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(`http://localhost:4000/products`, payload);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]});
    },
  });
};
