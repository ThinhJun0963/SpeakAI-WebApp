import { useState, useCallback } from "react";

const useApi = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFunction) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction();
      setData(response.data.result);
      return response.data.result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
  };
};

export default useApi;
