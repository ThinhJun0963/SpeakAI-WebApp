import React, { useState } from "react";
import { motion } from "framer-motion";
import { voucherApi } from "../../api/axiosInstance";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Switch,
  Modal,
} from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const CreateVoucherPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
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
    Modal.confirm({
      title: "Cancel Creation",
      content:
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      onOk: () => navigate("/vouchers"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <Card className="shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create New Voucher</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            voucherType: "Discount",
            isActive: true,
            status: true,
          }}
        >
          <Form.Item
            label="Voucher Code"
            name="voucherCode"
            rules={[
              { required: true, message: "Please input the voucher code!" },
            ]}
          >
            <Input placeholder="Enter voucher code" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Discount Percentage"
              name="discountPercentage"
              rules={[
                {
                  required: true,
                  message: "Please input the discount percentage!",
                },
                {
                  type: "string",
                  min: 0,
                  max: 100,
                  message: "Must be between 0 and 100",
                },
              ]}
            >
              <Input type="number" addonAfter="%" placeholder="0" />
            </Form.Item>
            <Form.Item
              label="Discount Amount"
              name="discountAmount"
              rules={[
                {
                  required: true,
                  message: "Please input the discount amount!",
                },
              ]}
            >
              <Input type="number" addonAfter="$" placeholder="0" />
            </Form.Item>
          </div>
          <Form.Item
            label="Valid Period"
            name="dateRange"
            rules={[
              { required: true, message: "Please select the valid period!" },
            ]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item
            label="Remaining Quantity"
            name="remainingQuantity"
            rules={[
              {
                required: true,
                message: "Please input the remaining quantity!",
              },
            ]}
          >
            <Input type="number" placeholder="0" />
          </Form.Item>
          <Form.Item label="Voucher Type" name="voucherType">
            <Select>
              <Select.Option value="Discount">Discount</Select.Option>
              <Select.Option value="Free Lesson">Free Lesson</Select.Option>
              <Select.Option value="Premium Access">
                Premium Access
              </Select.Option>
              <Select.Option value="AI Speaking Session">
                AI Speaking Session
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Voucher
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
};

export default CreateVoucherPage;
