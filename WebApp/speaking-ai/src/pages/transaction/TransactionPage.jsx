import React, { useState, useEffect, useCallback } from "react";
import { transactionApi, userApi } from "../../api/axiosInstance";
import {
  Table,
  Input,
  Select,
  Tag,
  Skeleton,
  Pagination,
  Card,
  Statistic,
  Row,
  Col,
  Modal,
} from "antd";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { Pie, Column } from "@ant-design/plots";
import moment from "moment";

const { Option } = Select;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Skeleton for Statistics Cards
const StatisticsCardsSkeleton = () => (
  <Row gutter={[16, 16]} className="mb-6">
    {[...Array(3)].map((_, index) => (
      <Col key={index} xs={24} sm={12} md={8}>
        <Card>
          <Skeleton active paragraph={false} title={{ width: "50%" }} />
          <Skeleton active paragraph={false} title={{ width: "30%" }} />
        </Card>
      </Col>
    ))}
  </Row>
);

// Skeleton for Charts
const ChartsSkeleton = () => (
  <Row gutter={[16, 16]} className="mb-6">
    {["Status Distribution", "Revenue Over Time (VND)"].map((title) => (
      <Col key={title} xs={24} md={12}>
        <Card title={title}>
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </Card>
      </Col>
    ))}
  </Row>
);

// Skeleton for Transaction Table
const TransactionTableSkeleton = () => (
  <div>
    <Skeleton
      active
      paragraph={false}
      title={{ width: "30%" }}
      className="mb-4"
    />
    <Skeleton active paragraph={{ rows: 5 }} />
    <Skeleton.Button
      active
      style={{ width: 200, height: 32 }}
      className="mt-4"
    />
  </div>
);

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await transactionApi.getList(
        statusFilter,
        currentPage,
        pageSize
      );
      const data = response.result || {};
      const transactionList = (data.items || []).map((t) => ({
        ...t,
        paymentMethod: t.paymentMethod || "PayOs",
        amount: t.amount || 0,
      }));

      const userIds = [...new Set(transactionList.map((t) => t.userId))];
      const userNameMap = Object.fromEntries(
        await Promise.all(
          userIds.map(async (userId) => [
            userId,
            (await userApi.getUserById(userId)).userName || "Unknown",
          ])
        )
      );

      setUserNames(userNameMap);
      setTransactions(transactionList);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setError("Failed to load transactions. Please try again later.");
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  const filteredTransactions = transactions.filter((t) =>
    userNames[t.userId]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTransactions = filteredTransactions?.length || 0; // Tránh undefined
  const totalRevenue =
    filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  const statusDistribution =
    filteredTransactions.reduce(
      (acc, t) => ({
        ...acc,
        [t.status]: (acc[t.status] || 0) + 1,
      }),
      {}
    ) || {}; // Đảm bảo là object

  const statusChartData =
    Object.entries(statusDistribution).length > 0
      ? Object.entries(statusDistribution).map(([type, count]) => ({
          type,
          percent:
            typeof totalTransactions === "number" && totalTransactions > 0
              ? (count / totalTransactions) * 100
              : 0,
          color:
            type === "Paid"
              ? "#52c41a"
              : type === "Pending"
              ? "#faad14"
              : "#ff4d4f",
        }))
      : [
          { type: "Paid", percent: 0, color: "#52c41a" },
          { type: "Pending", percent: 0, color: "#faad14" },
          { type: "Cancel", percent: 0, color: "#ff4d4f" },
        ];

  const revenueChartData = Object.entries(
    filteredTransactions.reduce(
      (acc, t) => ({
        ...acc,
        [moment(t.transactionDate).format("YYYY-MM-DD")]:
          (acc[moment(t.transactionDate).format("YYYY-MM-DD")] || 0) +
          (t.amount || 0),
      }),
      {}
    ) || {}
  ).map(([date, amount]) => ({ date, amount }));

  const formatVND = (amount) =>
    amount != null
      ? `${amount.toLocaleString("vi-VN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })},000đ`
      : "N/A";

  const columns = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      sorter: (a, b) =>
        new Date(a.transactionDate) - new Date(b.transactionDate),
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      title: "Amount (VND)",
      dataIndex: "amount",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      render: (amount) => formatVND(amount),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      render: (method) => method || "PayOs",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "Paid"
              ? "green"
              : status === "Pending"
              ? "yellow"
              : "red"
          }
        >
          {status || "Unknown"}
        </Tag>
      ),
    },
    {
      title: "Username",
      dataIndex: "userId",
      render: (userId) => userNames[userId] || "N/A",
    },
  ];

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={childVariants} className="text-2xl font-bold mb-6">
        Transaction Management
      </motion.h1>

      {/* Statistics Cards */}
      {loading ? (
        <StatisticsCardsSkeleton />
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Total Revenue (VND)"
                value={totalRevenue}
                formatter={formatVND}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Pending Transactions"
                value={statusDistribution.Pending || 0}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="Completed Transactions"
                value={statusDistribution.Paid || 0}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Charts */}
      {loading ? (
        <ChartsSkeleton />
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={12}>
            <Card title="Status Distribution">
              <Pie
                data={statusChartData}
                angleField="percent"
                colorField="type"
                radius={0.8}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Revenue Over Time (VND)">
              <Column
                data={revenueChartData}
                xField="date"
                yField="amount"
                meta={{ amount: { formatter: formatVND } }}
                label={{
                  position: "top",
                  style: { fill: "#fff", opacity: 0.6 },
                }}
                columnStyle={{ fill: "blue" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Transaction Table */}
      {loading ? (
        <TransactionTableSkeleton />
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-4 sm:mb-0">
              Transaction List
            </h2>
            <div className="flex space-y-4 sm:space-y-0 sm:space-x-4">
              <Input
                placeholder="Search by Username..."
                prefix={<Search className="h-4 w-4 text-gray-400" />}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
              <Select
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                className="w-32"
              >
                <Option value="All">All</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Paid">Paid</Option>
                <Option value="Failed">Failed</Option>
              </Select>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredTransactions}
            rowKey="transactionId"
            pagination={false}
            scroll={{ x: "max-content" }}
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
            className="text-center mt-4"
          />
        </>
      )}
    </motion.div>
  );
};

export default TransactionPage;
