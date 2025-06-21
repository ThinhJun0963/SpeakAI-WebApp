import React from "react";
import { Card, Button, Tag } from "antd";
import { Edit, Trash } from "lucide-react";

const VoucherCard = ({ voucher, onEdit, onDelete, loading }) => {
  return (
    <Card
      title={voucher.voucherCode}
      extra={
        <Tag color={voucher.isActive ? "green" : "red"}>
          {voucher.isActive ? "Active" : "Inactive"}
        </Tag>
      }
      actions={[
        <Button icon={<Edit />} onClick={onEdit} disabled={loading}>
          Edit
        </Button>,
        <Button icon={<Trash />} danger onClick={onDelete} disabled={loading}>
          Delete
        </Button>,
      ]}
    >
      <p>
        <strong>Description:</strong> {voucher.description || "N/A"}
      </p>
      <p>
        <strong>Discount:</strong> {voucher.discountPercentage}%{" "}
        {voucher.discountAmount > 0 && `+ $${voucher.discountAmount}`}
      </p>
      <p>
        <strong>Valid Period:</strong>{" "}
        {new Date(voucher.startDate).toLocaleDateString()} -{" "}
        {new Date(voucher.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Quantity:</strong> {voucher.remainingQuantity}
      </p>
    </Card>
  );
};

export default VoucherCard;
