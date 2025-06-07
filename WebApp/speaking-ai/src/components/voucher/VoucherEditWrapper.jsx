import React from "react";
import { useEditVoucher } from "../../hooks/useEditVoucher";

const VoucherEditWrapper = ({ children }) => {
  const { loading, error, editVoucher, voucher, fetchVoucher } =
    useEditVoucher();

  return React.cloneElement(children, {
    loading,
    error,
    editVoucher,
    voucher,
    fetchVoucher,
  });
};

export default VoucherEditWrapper;
