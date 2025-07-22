import React, { useState, useEffect, useCallback, useMemo } from "react";
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
} from "antd";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { Pie, Column } from "@ant-design/plots";
import moment from "moment";
import useApi from "../../components/hooks/useApi";

const { Option } = Select;

// Các biến thể animation cho giao diện
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

// Các thành phần Skeleton để hiển thị khi đang tải
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
  const { data: allTransactions, loading, error, execute } = useApi([]);
  const [userNames, setUserNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hàm lấy toàn bộ giao dịch từ API
  const fetchAllTransactions = async (status, pageSize = 100) => {
    let allTransactions = [];
    let currentPage = 1;
    let totalCount = 0;

    try {
      do {
        const response = await transactionApi.getList(
          "All", // Lấy tất cả trạng thái
          currentPage,
          pageSize
        );
        const data = response.result || {};
        const transactions = data.items || [];
        allTransactions = [...allTransactions, ...transactions];
        totalCount = data.totalCount || 0;
        currentPage += 1;
      } while (allTransactions.length < totalCount);
    } catch (error) {
      console.error("Failed to fetch all transactions:", error);
      throw error;
    }

    return allTransactions;
  };

  // Hàm lấy tên người dùng từ danh sách giao dịch
  const fetchUserNames = async (transactions) => {
    const userIds = [...new Set(transactions.map((t) => t.userId))];
    const userNameMap = Object.fromEntries(
      await Promise.all(
        userIds.map(async (userId) => [
          userId,
          (await userApi.getUserById(userId)).userName || "Unknown",
        ])
      )
    );
    setUserNames(userNameMap);
  };

  // Tải dữ liệu một lần khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await execute(fetchAllTransactions, "All");
        await fetchUserNames(transactions);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [execute]);

  // Xử lý tìm kiếm với debounce
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  // Lọc giao dịch theo statusFilter và searchTerm
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    // Áp dụng bộ lọc trạng thái
    if (statusFilter !== "All") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Áp dụng tìm kiếm theo tên người dùng
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        userNames[t.userId]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allTransactions, statusFilter, searchTerm, userNames]);

  // Phân trang giao dịch
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage, pageSize]);

  const totalCount = filteredTransactions.length;

  // Tính toán thống kê từ toàn bộ giao dịch
  const totalRevenue = allTransactions.reduce(
    (sum, t) => (t.status === "Paid" ? sum + (t.amount || 0) : sum),
    0
  );
  const statusDistribution = allTransactions.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  const revenueOverTime = Object.entries(
    allTransactions.reduce((acc, t) => {
      const date = moment(t.transactionDate).format("YYYY-MM-DD");
      acc[date] = (acc[date] || 0) + (t.amount || 0);
      return acc;
    }, {})
  ).map(([date, amount]) => ({ date, amount }));

  // Định dạng số tiền VND
  const formatVND = (amount) =>
    amount != null
      ? `${amount.toLocaleString("vi-VN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })},000đ`
      : "N/A";

  // Cấu hình cột cho bảng giao dịch
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

      {/* Thẻ thống kê */}
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

      {/* Biểu đồ */}
      {loading ? (
        <ChartsSkeleton />
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={12}>
            <Card title="Status Distribution">
              <Pie
                data={Object.entries(statusDistribution).map(
                  ([type, count]) => ({
                    type,
                    percent: (count / allTransactions.length) * 100 || 0,
                  })
                )}
                angleField="percent"
                colorField="type"
                radius={0.8}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Revenue Over Time (VND)">
              <Column
                data={revenueOverTime}
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

      {/* Bảng giao dịch */}
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
                <Option value="Cancel">Cancel</Option>
              </Select>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={paginatedTransactions}
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
            pageSizeOptions={["10", "20", "50", "100"]}
            className="text-center mt-4"
          />
        </>
      )}
    </motion.div>
  );
};

export default TransactionPage;
