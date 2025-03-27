import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { voucherApi } from "../../api/axiosInstance";
import { Card, Button, Input, Modal, Tag, Skeleton, Pagination } from "antd";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // 3x3 grid

  // Fetch all vouchers
  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await voucherApi.getAll();
      const voucherList = Array.isArray(data) ? data : [data];
      const sortedData = voucherList.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB - dateA;
      });
      setVouchers(sortedData);
      setFilteredVouchers(sortedData);
    } catch (err) {
      toast.error("Failed to load vouchers: " + err.message);
      Modal.error({ title: "Error", content: "Failed to load voucher list." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Handle search and filter
  useEffect(() => {
    let filtered = vouchers;
    if (searchTerm) {
      filtered = filtered.filter((voucher) =>
        voucher.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterActive !== "all") {
      filtered = filtered.filter(
        (voucher) => voucher.isActive === (filterActive === "active")
      );
    }
    if (filterType !== "all") {
      filtered = filtered.filter(
        (voucher) => voucher.voucherType.toLowerCase() === filterType
      );
    }
    setFilteredVouchers(filtered);
  }, [searchTerm, filterActive, filterType, vouchers]);

  // Handle delete voucher
  const handleDelete = async () => {
    if (!voucherToDelete) return;
    try {
      await voucherApi.delete(voucherToDelete.voucherId);
      setVouchers(
        vouchers.filter(
          (voucher) => voucher.voucherId !== voucherToDelete.voucherId
        )
      );
      toast.success(
        `Voucher ${voucherToDelete.voucherCode} deleted successfully!`
      );
    } catch (err) {
      toast.error("Failed to delete voucher: " + err.message);
    } finally {
      setIsDeleteModalOpen(false);
      setVoucherToDelete(null);
    }
  };

  const handleSearch = debounce((value) => setSearchTerm(value), 300);

  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Voucher Management
        </h1>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search by voucher code..."
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
            disabled={loading}
          />
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300 w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300 w-full sm:w-auto"
          >
            <option value="all">All Types</option>
            <option value="discount">Discount</option>
            <option value="free_lesson">Free Lesson</option>
            <option value="premium_access">Premium Access</option>
            <option value="ai_speaking_session">AI Speaking Session</option>
          </select>
          <Button
            type="primary"
            icon={<Plus />}
            onClick={() => (window.location.href = "/vouchers/create")}
            disabled={loading}
          >
            Add New Voucher
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} active paragraph={{ rows: 4 }} />
          ))}
        </div>
      ) : filteredVouchers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVouchers.map((voucher) => (
            <Card
              key={voucher.voucherId}
              title={voucher.voucherCode}
              extra={
                <Tag color={voucher.isActive ? "green" : "red"}>
                  {voucher.isActive ? "Active" : "Inactive"}
                </Tag>
              }
              actions={[
                <Button
                  icon={<Edit />}
                  onClick={() =>
                    (window.location.href = `/vouchers/edit/${voucher.voucherId}`)
                  }
                  disabled={loading}
                >
                  Edit
                </Button>,
                <Button
                  icon={<Trash />}
                  danger
                  onClick={() => {
                    setVoucherToDelete(voucher);
                    setIsDeleteModalOpen(true);
                  }}
                  disabled={loading}
                >
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
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No vouchers found.
        </div>
      )}

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredVouchers.length}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        showSizeChanger
        pageSizeOptions={["9", "18", "27"]}
        className="text-center mt-6"
      />

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalOpen}
          onOk={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to delete the voucher{" "}
            <span className="font-semibold">
              {voucherToDelete?.voucherCode}
            </span>
            ?
          </p>
        </Modal>
      )}
    </motion.div>
  );
};

export default VoucherPage;
