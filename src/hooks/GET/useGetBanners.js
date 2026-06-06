import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export const useGetBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/banners");
      return res.data
    },
  });
};
