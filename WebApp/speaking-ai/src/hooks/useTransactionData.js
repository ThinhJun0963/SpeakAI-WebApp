import { useState, useEffect, useCallback } from "react";
import { transactionApi, userApi } from "../api/axiosInstance";
import { Modal } from "antd";
import debounce from "lodash/debounce";
import moment from "moment";

const useTransactionData = () => {
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
      const transactionList = data.items || [];

      const validTransactions = transactionList.filter(
        (transaction) =>
          transaction.status && typeof transaction.status === "string"
      );

      const userIds = [...new Set(validTransactions.map((t) => t.userId))];
      const userNamePromises = userIds.map(async (userId) => {
        try {
          const userResponse = await userApi.getUserById(userId);
          return { userId, userName: userResponse.userName || "Unknown" };
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
      Modal.error({ title: "Error", content: "Failed to load transactions." });
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
    .filter((transaction) =>
      userNames[transaction.userId]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
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

  return {
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
  };
};

export default useTransactionData;
