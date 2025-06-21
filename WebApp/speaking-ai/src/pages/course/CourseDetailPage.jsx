// CourseDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Modal, Tag, Skeleton, Table, message, Image } from "antd";
import { Edit, Trash, Plus, Dumbbell } from "lucide-react";
import { usePageLoading } from "../../components/hooks/usePageLoading";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, trackAsyncOperation } = usePageLoading({ delay: 400 });
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await trackAsyncOperation(courseApi.getDetails(id).then(setCourse));
    };
    fetchData();
  }, [id, trackAsyncOperation]);

  const handleEditCourse = () => navigate(`/courses/edit/${id}`);
  const handleDeleteCourse = async () => {
    Modal.confirm({
      title: "Are you sure?",
      content: `This will delete "${course?.courseName}". This cannot be undone.`,
      onOk: async () => {
        await trackAsyncOperation(
          courseApi.delete(id).then(() => {
            navigate("/courses");
            message.success("Course deleted successfully.");
          })
        );
      },
    });
  };

  const handleAddTopic = () => {
    navigate(`/courses/${id}/add-topic-exercise?tab=topic`, {
      state: { from: "courseDetail" },
    });
  };

  const handleAddExercise = (topicId) => {
    if (!topicId) {
      message.error("No topic selected to add an exercise.");
      return;
    }
    navigate(
      `/courses/${id}/add-topic-exercise?tab=exercise&topicId=${topicId}`,
      { state: { from: "courseDetail" } }
    );
  };

  const topicColumns = [
    { title: "Topic Name", dataIndex: "topicName", key: "topicName" },
    { title: "Max Point", dataIndex: "maxPoint", key: "maxPoint" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<Dumbbell className="text-purple-600" />}
            onClick={() => handleAddExercise(record.id)}
            className="border-none hover:bg-purple-50 rounded-full p-2 transition-all duration-300 hover:scale-105"
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton active paragraph={{ rows: 2 }} className="mb-4" />
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (!course)
    return (
      <div className="text-center py-10 text-gray-500">Course not found</div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <Button
          onClick={() => navigate("/courses")}
          className="mb-4 sm:mb-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Back to Courses
        </Button>
        <div className="flex space-x-4">
          <Button
            type="primary"
            icon={<Edit className="mr-2" />}
            onClick={handleEditCourse}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Edit Course
          </Button>
          <Button
            icon={<Trash className="mr-2" />}
            onClick={handleDeleteCourse}
            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Delete Course
          </Button>
          <Button
            type="primary"
            icon={<Plus className="mr-2" />}
            onClick={handleAddTopic}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl px-6 py-3 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Add Topic
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {course.courseName}
            </h1>
            {course.imageUrl && (
              <Image
                src={course.imageUrl}
                alt={course.courseName}
                width={250}
                height={150}
                className="rounded-xl object-cover mb-4 sm:mb-0 sm:mr-6 transition-all duration-300 hover:scale-105 shadow-md"
                fallback="/placeholder-image.jpg"
              />
            )}
          </div>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Description:</strong>{" "}
              {course.description || "No description"}
            </p>
            <p className="text-lg">
              <strong>Max Points:</strong> {course.maxPoint || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Level:</strong>{" "}
              {["", "Beginner", "Intermediate", "Advanced"][course.levelId] ||
                "Undefined"}
            </p>
            <p className="text-lg">
              <strong>Status:</strong>{" "}
              <Tag
                color={course.isPremium ? "orange" : "green"}
                className="text-lg"
              >
                {course.isPremium ? "Premium" : "Free"}
              </Tag>
            </p>
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mt-8 mb-6">
          Topics
        </h2>
        <Table
          columns={topicColumns}
          dataSource={course.topics || []}
          rowKey="id"
          pagination={false}
          className="rounded-xl shadow-md"
          rowClassName="hover:bg-gray-50 transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default CourseDetailPage;
