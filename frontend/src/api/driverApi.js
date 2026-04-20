import api from "./api";

export const fetchOwnerDrivers = async () => {
  try {
    const { data } = await api.get("/owner/drivers");
    return data.drivers; // ye array of driver objects
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }
};
