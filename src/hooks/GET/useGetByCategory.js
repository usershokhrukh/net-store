import { useQuery } from "@tanstack/react-query"
import axios from "axios";

export const useGetByCategory = (categoryId) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: async ({queryKey}) => {
      const [, categoryId] = queryKey;
      const res = await axios.get(`http://localhost:4000/products?categoryId=${categoryId}`);
      return res?.data
    }
  })
}