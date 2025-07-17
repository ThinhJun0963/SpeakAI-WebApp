import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/axiosInstance";
import { Table, Button, Tag, Modal, Input, Select } from "antd";
import { Search } from "lucide-react";

const { Option } = Select;

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers(page, pageSize);
      const usersData = response.result || response;
      setUsers(usersData);
      setFilteredUsers(usersData);
      setPagination({
        ...pagination,
        current: page,
        pageSize,
        total: usersData.length, // Nếu API cung cấp totalCount, hãy dùng giá trị đó
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

  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = user.userName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Activated" && user.isActive) ||
        (statusFilter === "Not Activated" && !user.isActive);
      return matchesSearch && matchesStatus;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  const handleTableChange = (pagination, filters, sorter) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const handleActivateUser = async (userId) => {
    setLoading(true);
    try {
      await adminApi.updateUserStatus(userId, true); // Gửi isActive: true khi kích hoạt
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
      Modal.error({
        title: "Error",
        content: "Failed to activate user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    setLoading(true);
    try {
      await adminApi.updateUserStatus(userId, false); // Gửi isActive: false khi hủy kích hoạt
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, isActive: false } : user
        )
      );
      Modal.success({
        title: "Success",
        content: "User deactivated successfully.",
      });
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      Modal.error({
        title: "Error",
        content: "Failed to deactivate user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.birthday) - new Date(b.birthday),
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
          onClick={() =>
            record.isActive
              ? handleDeactivateUser(record.userId)
              : handleActivateUser(record.userId)
          }
          loading={loading}
        >
          {record.isActive ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Search by Username..."
          prefix={<Search className="h-4 w-4 text-gray-400" />}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          className="w-32"
        >
          <Option value="All">All</Option>
          <Option value="Activated">Activated</Option>
          <Option value="Not Activated">Not Activated</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
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
