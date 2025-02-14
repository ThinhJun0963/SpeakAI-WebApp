import axiosInstance from "../api/axiosConfig";

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/sign-in", credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login Failed");
    }
    throw error;
  }
};
