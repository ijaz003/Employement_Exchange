import axios from "axios";

const useAxios = () => {
  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
  });
  return axiosInstance;
};

export default useAxios;
