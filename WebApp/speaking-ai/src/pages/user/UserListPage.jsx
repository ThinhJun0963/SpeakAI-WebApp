import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/axiosInstance";
import { Table, Button, Tag, Modal } from "antd";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers(page, pageSize);
      const { items, totalCount } = response; // Assuming response has items and totalCount
      setUsers(items || response); // Fallback if structure differs
      setPagination({
        ...pagination,
        current: page,
        pageSize,
        total: totalCount || response.length, // Adjust based on actual API response
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Modal.error({ title: "Error", content: "Failed to load user list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const handleActivateUser = async (userId, currentStatus) => {
    if (currentStatus) {
      Modal.info({ title: "Info", content: "User is already activated." });
      return;
    }
    try {
      await adminApi.updateUserStatus(userId); // Always send true
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, isActive: true } : user
        )
      );
      Modal.success({
        title: "Success",
        content: "User activated successfully.",
      });
    } catch (error) {
      console.error("Failed to activate user:", error);
      Modal.error({ title: "Error", content: "Failed to activate user." });
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Premium",
      dataIndex: "isPremium",
      key: "isPremium",
      render: (isPremium) => (
        <Tag color={isPremium ? "gold" : "default"}>
          {isPremium ? "Premium" : "Standard"}
        </Tag>
      ),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified) => (
        <Tag color={isVerified ? "green" : "red"}>
          {isVerified ? "Verified" : "Not Verified"}
        </Tag>
      ),
    },
    {
      title: "Account Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Activated" : "Not Activated"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => handleActivateUser(record.userId, record.isActive)}
          disabled={record.isActive}
        >
          Activate
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="userId"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
};

export default UserListPage;
