import React, { useState, useEffect, useCallback } from "react";
import { courseApi } from "../../api/axiosInstance";
import {
  Table,
  Button,
  Input,
  Modal,
  Tag,
  Skeleton,
  Pagination,
  Tooltip,
  Image,
} from "antd";
import { Plus, Search, Edit, Trash, Eye, Book, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateCourseForm from "../../components/course/CreateCourseForm";
import debounce from "lodash/debounce";
import { usePageLoading } from "../../components/hooks/usePageLoading";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const { loading, trackAsyncOperation } = usePageLoading({});

  const fetchCourses = useCallback(async () => {
    return trackAsyncOperation(
      courseApi.getAll().then((data) => {
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          : [];
        setCourses(sortedData);
      })
    );
  }, [trackAsyncOperation]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleDelete = async (id, courseName) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `This action will delete the course "${courseName}". This cannot be undone.`,
      onOk: async () => {
        await trackAsyncOperation(
          courseApi.delete(id).then(() => {
            fetchCourses();
            Modal.success({
              title: "Success",
              content: "Course deleted successfully.",
            });
          })
        );
      },
      onCancel: () => {},
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (url) => (
        <Image
          src={url || "/placeholder-image.jpg"}
          alt="Course Image"
          width={80}
          height={80}
          className="rounded-lg object-cover"
          fallback="/placeholder-image.jpg"
        />
      ),
    },
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (text) => (
        <Tooltip title={text}>
          <span className="line-clamp-2">
            {text.length > 50 ? `${text.slice(0, 50)}...` : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Max Point",
      dataIndex: "maxPoint",
      key: "maxPoint",
      width: 100,
      align: "center",
    },
    {
      title: "Level",
      dataIndex: "levelId",
      key: "levelId",
      width: 120,
      align: "center",
      render: (id) =>
        ["", "Beginner", "Intermediate", "Advanced"][id] || "Undefined",
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Tag color={record.isPremium ? "orange" : "green"}>
          {record.isPremium ? "Premium" : "Free"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <div className="flex space-x-2 justify-center">
          <Tooltip title="View Details">
            <Button
              icon={<Eye className="text-blue-600" />}
              onClick={() => navigate(`/courses/${record.id}/details`)}
              className="border-none hover:bg-blue-50 rounded-full p-2"
              disabled={loading}
            />
          </Tooltip>
          <Tooltip title="Edit Course">
            <Button
              icon={<Edit className="text-green-600" />}
              onClick={() => navigate(`/courses/edit/${record.id}`)}
              className="border-none hover:bg-green-50 rounded-full p-2"
              disabled={loading}
            />
          </Tooltip>
          <Tooltip title="Delete Course">
            <Button
              icon={<Trash className="text-red-600" />}
              danger
              onClick={() => handleDelete(record.id, record.courseName)}
              className="border-none hover:bg-red-50 rounded-full p-2"
              disabled={loading}
            />
          </Tooltip>
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Course Management
        </h1>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder="Search courses..."
            prefix={<Search className="h-5 w-5 text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64 rounded-md border-gray-300 shadow-sm"
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<Plus className="mr-2" />}
            onClick={() => setIsCreateModalVisible(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
            disabled={loading}
          >
            Create Course
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : filteredCourses.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={paginatedCourses}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1000 }}
            className="rounded-lg shadow-md overflow-hidden"
            rowClassName="hover:bg-gray-50 transition-colors duration-200"
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
            pageSizeOptions={["5", "10", "15", "20"]}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`
            }
            itemRender={(current, type, originalElement) => {
              if (type === "prev") {
                return (
                  <Button className="mr-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                    Previous
                  </Button>
                );
              }
              if (type === "next") {
                return (
                  <Button className="ml-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                    Next
                  </Button>
                );
              }
              if (type === "jump-prev" || type === "jump-next") {
                return <span className="px-2 text-gray-500">...</span>;
              }
              return originalElement;
            }}
            className="flex justify-center items-center mt-6 space-x-2"
          />
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">No courses found.</div>
      )}

      <CreateCourseForm
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={fetchCourses}
      />
    </div>
  );
};

export default CoursePage;
