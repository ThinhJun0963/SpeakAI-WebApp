import React from "react";
import { Table, Input, Button, Pagination } from "antd";
import { Plus, Search, Eye, Edit, Trash } from "lucide-react";
import { Skeleton } from "antd";

const CourseTable = ({
  courses,
  loading,
  searchTerm,
  handleSearch,
  onCreate,
  onView,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
}) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  const columns = [
    { title: "Course Name", dataIndex: "courseName", key: "courseName" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Max Point", dataIndex: "maxPoint", key: "maxPoint" },
    {
      title: "Level",
      dataIndex: "levelId",
      key: "levelId",
      render: (id) =>
        ["", "Beginner", "Intermediate", "Advanced"][id] || "Undefined",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isPremium ? "orange" : "green"}>
          {record.isPremium ? "Premium" : "Free"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<Eye />}
            onClick={() => onView(record.id)}
            className="border-none hover:bg-gray-100"
            disabled={loading}
          />
          <Button
            icon={<Edit />}
            onClick={() => onEdit(record.id)}
            className="border-none hover:bg-gray-100"
            disabled={loading}
          />
          <Button
            icon={<Trash />}
            danger
            onClick={() => onDelete(record.id, record.courseName)}
            className="border-none hover:bg-red-100"
            disabled={loading}
          />
        </div>
      ),
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Course Management
        </h1>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search courses..."
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<Plus />}
            onClick={onCreate}
            disabled={loading}
          >
            Create Course
          </Button>
        </div>
      </div>
      {filteredCourses.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={paginatedCourses}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
            className="mb-4"
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredCourses.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            className="text-center"
          />
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">No courses found.</div>
      )}
    </>
  );
};

export default CourseTable;
