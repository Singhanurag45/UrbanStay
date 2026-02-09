import api from "./axios";

export const searchHotels = async () => {
  const res = await api.get("/hotels/search");
  return res.data;
};
