import React from "react";
import { motion } from "framer-motion";
import useTransactionData from "../../hooks/useTransactionData";
import StatisticsCards from "../../components/transaction/StatisticsCards";
import Charts from "../../components/transaction/Charts";
import TransactionTable from "../../components/transaction/TransactionTable";

// Variants cho hiệu ứng load của container chính
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Variants cho các thành phần con
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const TransactionPage = () => {
  const {
    transactions,
    userNames,
    loading,
    searchTerm,
    statusFilter,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    sortField,
    sortOrder,
    filteredTransactions,
    totalRevenue,
    statusDistribution,
    statusChartData,
    revenueChartData,
    columns,
    handleSearch,
    handleStatusFilter,
    handleTableChange,
    setCurrentPage,
    setPageSize,
  } = useTransactionData();

  const pendingCount = statusDistribution.Pending || 0;
  const completedCount = statusDistribution.Paid || 0;

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants}>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Transaction Management
        </h1>
      </motion.div>

      <StatisticsCards
        totalRevenue={totalRevenue}
        pendingCount={pendingCount}
        completedCount={completedCount}
        loading={loading}
      />

      <Charts
        statusChartData={statusChartData}
        revenueChartData={revenueChartData}
        loading={loading}
      />

      <TransactionTable
        filteredTransactions={filteredTransactions}
        columns={columns}
        handleSearch={handleSearch}
        handleStatusFilter={handleStatusFilter}
        statusFilter={statusFilter}
        handleTableChange={handleTableChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        loading={loading}
      />
    </motion.div>
  );
};

export default TransactionPage;
