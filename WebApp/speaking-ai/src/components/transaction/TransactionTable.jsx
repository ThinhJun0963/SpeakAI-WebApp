import React from "react";
import { Table, Input, Select, Pagination } from "antd";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "antd";

const { Option } = Select;

const TransactionTable = ({
  filteredTransactions,
  columns,
  handleSearch,
  handleStatusFilter,
  statusFilter,
  handleTableChange,
  currentPage,
  pageSize,
  totalCount,
  setCurrentPage,
  setPageSize,
  loading,
}) => {
  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <Skeleton active paragraph={false} title={{ width: "30%" }} />
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Skeleton.Input active style={{ width: 256, height: 40 }} />
            <Skeleton.Input active style={{ width: 128, height: 40 }} />
          </div>
        </div>
        <Skeleton active paragraph={{ rows: 5 }} />
        <div className="text-center mt-4">
          <Skeleton.Button active style={{ width: 200, height: 32 }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Transaction List
        </h2>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search by Username..."
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
            disabled={loading}
          />
          <Select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full sm:w-32"
            disabled={loading}
          >
            <Option value="All">All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Paid">Paid</Option>
            <Option value="Failed">Failed</Option>
          </Select>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={filteredTransactions}
            rowKey={(record) => record.transactionId}
            pagination={false}
            scroll={{ x: "max-content" }}
            onChange={handleTableChange}
            className="mb-4"
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={["5", "10", "20"]}
            className="text-center"
          />
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No transactions found.
        </div>
      )}
    </motion.div>
  );
};

export default TransactionTable;
