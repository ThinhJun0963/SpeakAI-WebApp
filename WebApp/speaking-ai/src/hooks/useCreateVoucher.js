import { useState } from "react";
import { voucherApi } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useCreateVoucher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
        endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
        discountPercentage: parseFloat(values.discountPercentage),
        discountAmount: parseFloat(values.discountAmount),
        remainingQuantity: parseInt(values.remainingQuantity),
      };
      await voucherApi.create(payload);
      toast.success("Voucher created successfully!");
      navigate("/vouchers");
    } catch (err) {
      toast.error("Failed to create voucher: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      navigate("/vouchers");
    }
  };

  return { loading, onFinish, handleCancel };
};

export default useCreateVoucher;
