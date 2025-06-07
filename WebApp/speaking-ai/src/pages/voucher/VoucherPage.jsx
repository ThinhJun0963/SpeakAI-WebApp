import React from "react";
import { motion } from "framer-motion";
import useVoucherList from "../../hooks/useVoucherList";
import VoucherList from "../../components/voucher/VoucherList";
import { Modal } from "antd";

const VoucherPage = () => {
  const {
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
  } = useVoucherList();

  const onEdit = (voucherId) => {
    window.location.href = `/vouchers/edit/${voucherId}`;
  };

  const onDelete = (voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalOpen(true);
  };

  const onAddNew = () => {
    window.location.href = "/vouchers/create";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <VoucherList
        searchTerm={searchTerm}
        filterActive={filterActive}
        filterType={filterType}
        handleSearch={handleSearch}
        setFilterActive={setFilterActive}
        setFilterType={setFilterType}
        paginatedVouchers={paginatedVouchers}
        onAddNew={onAddNew}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
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
