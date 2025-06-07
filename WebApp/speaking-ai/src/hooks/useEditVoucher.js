// src/hooks/useEditVoucher.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { voucherApi } from "../api/axiosInstance";

export const useEditVoucher = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setLoading(true);
        const response = await voucherApi.getDetails(id);
        setVoucher(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVoucher();
  }, [id]);

  const editVoucher = async (data) => {
    try {
      setLoading(true);
      const response = await voucherApi.update(id, data);
      setVoucher(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, editVoucher, voucher, fetchVoucher };
};

export default useEditVoucher;
