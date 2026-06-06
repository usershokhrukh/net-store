import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/categories");

      return res.data;
    },
  });
};
