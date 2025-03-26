import React, { useState, useEffect, useCallback, useRef } from "react";
import { courseApi } from "../../api/axiosInstance";
import { Table, Button, Input, Modal, Tag } from "antd";
import { Plus, Search, Edit, Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import CourseEditForm from "./../../components/course/CourseEditForm";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editCourseId, setEditCourseId] = useState(null);
  const navigate = useNavigate();
  const isInitialFetch = useRef(true);

  const fetchCourses = useCallback(
    async (forceFetch = false) => {
      if (!forceFetch && !isInitialFetch.current) return;

      setLoading(true);
      try {
        const data = await courseApi.getAll();
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => {
              const dateA = new Date(a.updatedAt || a.createdAt);
              const dateB = new Date(b.updatedAt || b.createdAt);
              return dateB - dateA;
            })
          : [];
        setCourses(sortedData);
        isInitialFetch.current = false;
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        Modal.error({
          title: "Error",
          content: "Failed to load course list.",
          onOk: () => navigate(-1),
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (isInitialFetch.current) fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: async () => {
        setLoading(true);
        try {
          await courseApi.delete(id);
          fetchCourses(true);
        } catch (error) {
          Modal.error({ title: "Error", content: "Failed to delete course." });
        } finally {
          setLoading(false);
        }
      },
    });
  };

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
            onClick={() => navigate(`/courses/${record.id}/details`)}
            className="border-none hover:bg-gray-100"
            disabled={loading}
          />
          <Button
            icon={<Edit />}
            onClick={() => setEditCourseId(record.id)}
            className="border-none hover:bg-gray-100"
            disabled={loading}
          />
          <Button
            icon={<Trash />}
            danger
            onClick={() => handleDelete(record.id)}
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Course Management
        </h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search courses..."
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<Plus />}
            onClick={() => navigate("/courses/create")}
            disabled={loading}
          >
            Create Course
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filteredCourses.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          loading={loading}
        />
      ) : (
        <div className="text-center py-10 text-gray-500">No courses found.</div>
      )}

      {editCourseId && (
        <CourseEditForm
          courseId={editCourseId}
          visible={!!editCourseId}
          onCancel={() => setEditCourseId(null)}
          onSuccess={() => {
            setEditCourseId(null);
            fetchCourses(true);
          }}
        />
      )}
    </div>
  );
};

export default CoursePage;
