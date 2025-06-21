import React from "react";
import { motion } from "framer-motion";
import { Form } from "antd";
import useEditVoucher from "../../hooks/useEditVoucher";
import VoucherForm from "../../components/voucher/VoucherForm";

const VoucherEditPage = () => {
  const { loading, submitLoading, form, onFinish, handleCancel } =
    useEditVoucher();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <Card className="shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Voucher</h1>
        <VoucherForm
          form={form}
          onFinish={onFinish}
          handleCancel={handleCancel}
          loading={loading}
          submitLoading={submitLoading}
          title="Edit Voucher"
        />
      </Card>
    </motion.div>
  );
};

export default VoucherEditPage;
