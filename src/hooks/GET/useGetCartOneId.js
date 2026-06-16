import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export const useGetCartOneId = (payload) => {
  return useQuery({
    queryKey: ["cart", payload[0], payload[1]],
    queryFn: async ({queryKey}) => {            
      const [, id, userId] = queryKey;
      const res = await axios.get(
        `http://localhost:4000/cart?productId=${Number(id) || id}&userId=${userId ? Number(userId) || userId : null}`,
      );

      return res.data;
    },
  });
};
