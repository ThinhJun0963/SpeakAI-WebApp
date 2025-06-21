import { useState, useCallback } from "react";

const useApi = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(...args);
      console.log("Raw response in useApi:", response);
      const result =
        response && response.data !== undefined
          ? response.data
          : response || [];
      const finalData = Array.isArray(result) ? result : [];
      setData(finalData);
      return finalData;
    } catch (err) {
      const message = err.message || "An error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};

export default useApi;
