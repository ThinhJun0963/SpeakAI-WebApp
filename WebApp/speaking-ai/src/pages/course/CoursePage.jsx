import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/axiosInstance";
import { Table, Button, Input, Modal, Spin, Tag } from "antd";
import { Plus, Search, Edit, Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCourse, setViewCourse] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseApi.getAll();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await courseApi.delete(id);
          fetchCourses();
        } catch (error) {
          Modal.error({ title: "Error", content: "Failed to delete course." });
        }
      },
    });
  };

  const handleViewDetails = async (id) => {
    try {
      const data = await courseApi.getDetails(id);
      setViewCourse(data);
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Failed to fetch course details.",
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/courses/edit/${id}`);
  };

  const columns = [
    { title: "Name", dataIndex: "courseName", key: "courseName" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Max Points", dataIndex: "maxPoint", key: "maxPoint" },
    {
      title: "Level",
      dataIndex: "levelId",
      key: "levelId",
      render: (id) => ["", "Beginner", "Intermediate", "Advanced"][id],
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <>
          {record.isFree && <Tag color="green">Free</Tag>}
          {record.isPremium && <Tag color="orange">Premium</Tag>}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button icon={<Eye />} onClick={() => handleViewDetails(record.id)} />
          <Button icon={<Edit />} onClick={() => handleEdit(record.id)} />
          <Button
            icon={<Trash />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Course Management
        </h1>
        <Button
          type="primary"
          icon={<Plus />}
          onClick={() => navigate("/courses/create")}
        >
          Create Course
        </Button>
      </div>
      <Input
        placeholder="Search courses..."
        prefix={<Search />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-1/3"
      />
      {loading ? (
        <Spin /> // Xóa tip
      ) : (
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      )}

      {viewCourse && (
        <Modal
          title={viewCourse.courseName}
          open={!!viewCourse}
          onCancel={() => setViewCourse(null)}
          footer={null}
          width={800}
        >
          <p>
            <strong>Description:</strong> {viewCourse.description}
          </p>
          <p>
            <strong>Max Points:</strong> {viewCourse.maxPoint}
          </p>
          <p>
            <strong>Level:</strong>{" "}
            {["", "Beginner", "Intermediate", "Advanced"][viewCourse.levelId]}
          </p>
          <p>
            <strong>Free:</strong> {viewCourse.isFree ? "Yes" : "No"}
          </p>
          <p>
            <strong>Premium:</strong> {viewCourse.isPremium ? "Yes" : "No"}
          </p>
          <h3 className="mt-4 font-semibold">Topics:</h3>
          {viewCourse.topics?.map((topic) => (
            <div key={topic.id} className="mt-2">
              <p>
                <strong>{topic.topicName}</strong> (Max Points: {topic.maxPoint}
                )
              </p>
              <ul className="ml-4">
                {topic.exercises.map((exercise) => (
                  <li key={exercise.id}>
                    {exercise.content} (Points: {exercise.maxPoint})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
};

export default CoursePage;
