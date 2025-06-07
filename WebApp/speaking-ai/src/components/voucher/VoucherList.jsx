import React from "react";
import { Input, Button, Pagination } from "antd";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "antd";

const VoucherList = ({
  searchTerm,
  filterActive,
  filterType,
  handleSearch,
  setFilterActive,
  setFilterType,
  paginatedVouchers,
  onAddNew,
  onEdit,
  onDelete,
  loading,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} active paragraph={{ rows: 4 }} />
        ))}
      </div>
    );
  }

  return (
    <>
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
            onClick={onAddNew}
            disabled={loading}
          >
            Add New Voucher
          </Button>
        </div>
      </div>

      {paginatedVouchers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVouchers.map((voucher) => (
            <VoucherCard
              key={voucher.voucherId}
              voucher={voucher}
              onEdit={() => onEdit(voucher.voucherId)}
              onDelete={() => onDelete(voucher)}
              loading={loading}
            />
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
    </>
  );
};

export default VoucherList;
