import React from "react";
import { Form, Input, Button, DatePicker, Select, Switch } from "antd";
import { Skeleton } from "antd";

const { RangePicker } = DatePicker;

const VoucherForm = ({
  form,
  onFinish,
  handleCancel,
  loading,
  submitLoading,
  title = "Create New Voucher",
}) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Voucher Code"
        name="voucherCode"
        rules={[{ required: true, message: "Please input the voucher code!" }]}
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
            { required: true, message: "Please input the discount amount!" },
          ]}
        >
          <Input type="number" addonAfter="$" placeholder="0" />
        </Form.Item>
      </div>
      <Form.Item
        label="Valid Period"
        name="dateRange"
        rules={[{ required: true, message: "Please select the valid period!" }]}
      >
        <RangePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>
      <Form.Item
        label="Remaining Quantity"
        name="remainingQuantity"
        rules={[
          { required: true, message: "Please input the remaining quantity!" },
        ]}
      >
        <Input type="number" placeholder="0" />
      </Form.Item>
      <Form.Item label="Voucher Type" name="voucherType">
        <Select>
          <Select.Option value="Discount">Discount</Select.Option>
          <Select.Option value="Free Lesson">Free Lesson</Select.Option>
          <Select.Option value="Premium Access">Premium Access</Select.Option>
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
          <Button onClick={handleCancel} disabled={submitLoading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            {title === "Create New Voucher"
              ? "Create Voucher"
              : "Update Voucher"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default VoucherForm;
