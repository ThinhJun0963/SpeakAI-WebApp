import { useState, useEffect, useCallback } from "react";
import { voucherApi } from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Modal } from "antd";
import debounce from "lodash/debounce";

const useVoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

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

  return {
    vouchers,
    filteredVouchers,
    loading,
    searchTerm,
    filterActive,
    filterType,
    isDeleteModalOpen,
    voucherToDelete,
    currentPage,
    pageSize,
    paginatedVouchers,
    handleSearch,
    setFilterActive,
    setFilterType,
    setIsDeleteModalOpen,
    setVoucherToDelete,
    handleDelete,
    setCurrentPage,
    setPageSize,
  };
};

export default useVoucherList;
