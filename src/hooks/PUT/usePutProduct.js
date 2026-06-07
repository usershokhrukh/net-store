import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export const usePutProduct = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async (payload) => {      
      console.log(payload);
      
      const res = await axios.put(`http://localhost:4000/products/${payload[0]}`, payload[1]);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]});
    },
  });
};
