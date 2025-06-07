import React from "react";
import { motion } from "framer-motion";
import { Form } from "antd";
import useCreateVoucher from "../../hooks/useCreateVoucher";
import VoucherForm from "../../components/voucher/VoucherForm";

const CreateVoucherPage = () => {
  const { loading, onFinish, handleCancel } = useCreateVoucher();
  const [form] = Form.useForm();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <Card className="shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create New Voucher</h1>
        <VoucherForm
          form={form}
          onFinish={onFinish}
          handleCancel={handleCancel}
          loading={loading}
        />
      </Card>
    </motion.div>
  );
};

export default CreateVoucherPage;
