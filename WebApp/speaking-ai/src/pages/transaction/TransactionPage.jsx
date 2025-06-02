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
import { Line, Pie } from "@ant-design/plots";
import moment from "moment";

const { Option } = Select;

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

// Skeleton cho Statistics Cards
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

// Skeleton cho Charts
const ChartsSkeleton = () => (
  <Row gutter={[16, 16]} className="mb-6">
    <Col xs={24} md={12}>
      <Card title="Status Distribution">
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      </Card>
    </Col>
    <Col xs={24} md={12}>
      <Card title="Revenue Over Time (VND)">
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      </Card>
    </Col>
  </Row>
);

// Skeleton cho Transaction Table (bao gồm search bar, status filter, table, và pagination)
const TransactionTableSkeleton = () => (
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

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("transactionDate");
  const [sortOrder, setSortOrder] = useState("descend");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await transactionApi.getList(
        statusFilter,
        currentPage,
        pageSize
      );
      const data = response.result || {};
      console.log("Transaction data:", data);
      const transactionList = data.items || [];

      const validTransactions = transactionList.filter(
        (transaction) =>
          transaction.status && typeof transaction.status === "string"
      );

      const userIds = [...new Set(validTransactions.map((t) => t.userId))];
      const userNamePromises = userIds.map(async (userId) => {
        try {
          const userResponse = await userApi.getUserById(userId);
          return {
            userId,
            userName: userResponse.userName || "Unknown",
          };
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          return { userId, userName: "Unknown" };
        }
      });

      const userNameResults = await Promise.all(userNamePromises);
      const userNameMap = userNameResults.reduce(
        (acc, { userId, userName }) => {
          acc[userId] = userName;
          return acc;
        },
        {}
      );

      setUserNames(userNameMap);
      setTransactions(validTransactions);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      Modal.error({
        title: "Error",
        content: "Failed to load transactions.",
      });
      setTransactions([]);
      setTotalCount(0);
      setTotalPages(1);
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

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortField(sorter.field || "transactionDate");
    setSortOrder(sorter.order || "descend");
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      const searchLower = searchTerm.toLowerCase();
      return userNames[transaction.userId]?.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (sortField === "transactionDate") {
        return sortOrder === "ascend"
          ? new Date(fieldA) - new Date(fieldB)
          : new Date(fieldB) - new Date(fieldA);
      }
      return sortOrder === "ascend" ? fieldA - fieldB : fieldB - fieldA;
    });

  const totalRevenue = transactions.reduce(
    (sum, transaction) => sum + (transaction.amount || 0),
    0
  );
  const statusDistribution = transactions.reduce((acc, transaction) => {
    const status = transaction.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.keys(statusDistribution).map((status) => ({
    type: status,
    value: statusDistribution[status],
    color:
      status === "Paid"
        ? "#52c41a"
        : status === "Pending"
        ? "#faad14"
        : status === "Failed"
        ? "#ff4d4f"
        : "#d9d9d9",
  }));

  const revenueChartData = transactions
    .map((transaction) => ({
      date: moment(transaction.transactionDate).format("YYYY-MM-DD"),
      amount: transaction.amount || 0,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const columns = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      sorter: true,
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      title: "Amount (VND)",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (amount) => (amount !== undefined ? `${amount}` : "N/A"),
    },
    {
      title: "Payment Method",
      key: "paymentMethod",
      render: () => "VnPay",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Paid"
            ? "green"
            : status === "Pending"
            ? "yellow"
            : status === "Failed"
            ? "red"
            : "gray";
        return <Tag color={color}>{status || "Unknown"}</Tag>;
      },
    },
    {
      title: "Username",
      dataIndex: "userId",
      key: "userId",
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
      <motion.div variants={childVariants}>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Transaction Management
        </h1>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={childVariants}>
        {loading ? (
          <StatisticsCardsSkeleton />
        ) : (
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Total Revenue (VND)"
                  value={totalRevenue}
                  precision={1}
                  prefix="₫"
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
      </motion.div>

      {/* Charts */}
      <motion.div variants={childVariants}>
        {loading ? (
          <ChartsSkeleton />
        ) : (
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} md={12}>
              <Card title="Status Distribution">
                {statusChartData.length > 0 ? (
                  <Pie
                    data={statusChartData}
                    angleField="value"
                    colorField="type"
                    color={({ type }) =>
                      type === "Paid"
                        ? "#52c41a"
                        : type === "Pending"
                        ? "#faad14"
                        : type === "Failed"
                        ? "#ff4d4f"
                        : "#d9d9d9"
                    }
                    radius={0.8}
                    innerRadius={0.6}
                    label={{
                      offset: -20,
                      content: ({ percent }) =>
                        `${(percent * 100).toFixed(0)}%`,
                      style: {
                        fontSize: 14,
                        textAlign: "center",
                        fill: "#fff",
                      },
                    }}
                    statistic={{
                      title: {
                        content: "Transactions",
                        style: { fontSize: 16 },
                      },
                      content: { style: { fontSize: 20 } },
                    }}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No data available.
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Revenue Over Time (VND)">
                {revenueChartData.length > 0 ? (
                  <Line
                    data={revenueChartData}
                    xField="date"
                    yField="amount"
                    yAxis={{
                      label: { formatter: (v) => `${v}` },
                    }}
                    point={{
                      size: 5,
                      shape: "diamond",
                      style: { fill: "#1890ff" },
                    }}
                    lineStyle={{ stroke: "#1890ff", lineWidth: 2 }}
                    tooltip={{
                      formatter: (datum) => ({
                        name: "Revenue",
                        value: `${datum.amount} VND`,
                      }),
                    }}
                    smooth
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No data available.
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        )}
      </motion.div>

      {/* Transaction Table */}
      <motion.div variants={childVariants}>
        {loading ? (
          <TransactionTableSkeleton />  
        ) : (
          <>
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

            {transactions.length > 0 ? (
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
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TransactionPage;
