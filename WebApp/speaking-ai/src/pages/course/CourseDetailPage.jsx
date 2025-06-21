import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Modal, Tag, Skeleton, Table, message, Image } from "antd";
import { Edit, Trash, Plus, Eye } from "lucide-react";
import { usePageLoading } from "../../components/hooks/usePageLoading";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, trackAsyncOperation } = usePageLoading({ delay: 400 });
  const [course, setCourse] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await trackAsyncOperation(courseApi.getDetails(id));
        console.log("API Response in CourseDetailPage:", response);
        setCourse(response.result || response);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        message.error(
          "Failed to load course details. Please check the course ID or try again."
        );
      }
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

  const handleEditTopic = (topicId) => {
    navigate(`/courses/${id}/edit-topic/${topicId}`);
  };

  const handleDeleteTopic = (topicId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will delete the topic. This cannot be undone.",
      onOk: async () => {
        await courseApi.deleteTopic(topicId);
        message.success("Topic deleted successfully");
        const updatedCourse = await courseApi.getDetails(id);
        setCourse(updatedCourse.result || updatedCourse);
      },
    });
  };

  const handleAddExercise = (topicId) => {
    navigate(
      `/courses/${id}/add-topic-exercise?tab=exercise&topicId=${topicId}`,
      {
        state: { from: "courseDetail" },
      }
    );
  };

  const handleEditExercise = (exerciseId) => {
    navigate(`/courses/${id}/edit-exercise/${exerciseId}`);
  };

  const handleDeleteExercise = (exerciseId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will delete the exercise. This cannot be undone.",
      onOk: async () => {
        try {
          await courseApi.deleteExercise(exerciseId);
          message.success("Exercise deleted successfully.");
          const updatedCourse = await courseApi.getDetails(id);
          setCourse(updatedCourse.result || updatedCourse);
        } catch (error) {
          message.error("Failed to delete exercise.");
        }
      },
    });
  };

  const topicColumns = [
    {
      title: "Topic Name",
      dataIndex: "topicName",
      key: "topicName",
      ellipsis: true,
      className: "text-gray-800 font-medium",
    },
    {
      title: "Max Point",
      dataIndex: "maxPoint",
      key: "maxPoint",
      align: "center",
      className: "text-gray-700",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center space-x-2">
          <Button
            icon={<Edit className="text-blue-600" />}
            onClick={() => handleEditTopic(record.id)}
            className="border-none hover:bg-blue-50 rounded-full p-2 transition-all duration-300 hover:scale-105"
            title="Edit Topic"
          >
            Edit
          </Button>
          <Button
            icon={<Trash className="text-red-600" />}
            onClick={() => handleDeleteTopic(record.id)}
            className="border-none hover:bg-red-50 rounded-full p-2 transition-all duration-300 hover:scale-105"
            title="Delete Topic"
          >
            Delete
          </Button>
          <Button
            icon={<Eye className="text-green-600" />}
            onClick={() => {
              const newExpandedKeys = expandedRowKeys.includes(record.id)
                ? expandedRowKeys.filter((key) => key !== record.id)
                : [...expandedRowKeys, record.id];
              setExpandedRowKeys(newExpandedKeys);
            }}
            className="border-none hover:bg-green-50 rounded-full p-2 transition-all duration-300 hover:scale-105 flex items-center"
            title={
              expandedRowKeys.includes(record.id)
                ? "Hide Exercises"
                : "View Exercises"
            }
          >
            <span className="ml-1">View</span>
          </Button>
        </div>
      ),
    },
  ];

  const exerciseColumns = [
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      className: "text-gray-800",
    },
    {
      title: "Question Content",
      dataIndex: ["questions", 0, "content"],
      key: "questionContent",
      ellipsis: true,
      className: "text-gray-700",
    },
    {
      title: "Max Point",
      dataIndex: "maxPoint",
      key: "maxPoint",
      align: "center",
      className: "text-gray-700",
    },
    {
      title: "Type",
      dataIndex: "typeId",
      key: "typeId",
      render: (typeId) =>
        ["Multiple Choice", "Fill in Blank", "True/False"][typeId - 1] ||
        "Unknown",
      className: "text-gray-700",
    },
    {
      title: "Answers",
      dataIndex: ["questions", 0, "answers"],
      key: "answers",
      render: (answers) =>
        answers ? `${answers.length} answers` : "No answers",
      className: "text-gray-700",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center space-x-2">
          <Button
            icon={<Edit className="text-blue-600" />}
            onClick={() => handleEditExercise(record.id)}
            className="border-none hover:bg-blue-50 rounded-full p-2 transition-all duration-300 hover:scale-105"
            title="Edit Exercise"
          >
            Edit
          </Button>
          <Button
            icon={<Trash className="text-red-600" />}
            onClick={() => handleDeleteExercise(record.id)}
            className="border-none hover:bg-red-50 rounded-full p-2 transition-all duration-300 hover:scale-105"
            title="Delete Exercise"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const expandedRowRender = (record) => (
    <div className="p-4 bg-white/80 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-indigo-900 mb-4 border-b border-indigo-200 pb-2">
        Exercises
      </h3>
      <div className="mb-6">
        <Button
          icon={<Plus className="text-purple-600" />}
          onClick={() => handleAddExercise(record.id)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg px-4 py-2 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
          title="Add Exercise"
        >
          Add Exercise
        </Button>
      </div>
      <Table
        columns={exerciseColumns}
        dataSource={record.exercises || []}
        rowKey="id"
        pagination={false}
        className="custom-table rounded-lg overflow-hidden"
        rowClassName="hover:bg-indigo-50 transition-colors duration-300"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton active paragraph={{ rows: 2 }} className="mb-6" />
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12 text-gray-500">
        Course not found. Please check the course ID or contact support. (ID:{" "}
        {id})
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl bg-gradient-to-br from-gray-50 to-white/80 min-h-screen rounded-xl shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <Button
          onClick={() => navigate("/courses")}
          className="mb-4 sm:mb-0 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          ← Back to Courses
        </Button>
        <div className="flex space-x-4">
          <Button
            type="primary"
            icon={<Edit className="mr-2" />}
            onClick={handleEditCourse}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
          >
            Edit Course
          </Button>
          <Button
            icon={<Trash className="mr-2" />}
            onClick={handleDeleteCourse}
            className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg hover:from-red-700 hover:to-rose-700"
          >
            Delete Course
          </Button>
          <Button
            type="primary"
            icon={<Plus className="mr-2" />}
            onClick={handleAddTopic}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl px-6 py-3 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Add Topic
          </Button>
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl p-8 shadow-xl border border-gray-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mb-6">
              {course.courseName}
            </h1>
            {course.imgUrl && (
              <div className="w-full h-56 overflow-hidden rounded-xl shadow-md">
                <Image
                  src={course.imgUrl}
                  alt={course.courseName}
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                  fallback="/placeholder-image.jpg"
                />
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="p-6 bg-gray-50/80 rounded-xl shadow-inner">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold text-indigo-800">
                    Description:
                  </span>{" "}
                  {course.description || "No description available"}
                </p>
              </div>
              <div className="p-6 bg-gray-50/80 rounded-xl shadow-inner">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold text-indigo-800">
                    Max Points:
                  </span>{" "}
                  {course.maxPoint || "N/A"}
                </p>
              </div>
              <div className="p-6 bg-gray-50/80 rounded-xl shadow-inner">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold text-indigo-800">Level:</span>{" "}
                  {["", "Beginner", "Intermediate", "Advanced"][
                    course.levelId
                  ] || "Undefined"}
                </p>
              </div>
              <div className="p-6 bg-gray-50/80 rounded-xl shadow-inner">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold text-indigo-800">Status:</span>{" "}
                  <Tag
                    color={course.isPremium ? "orange" : "green"}
                    className="ml-2 text-md font-medium py-1 px-3 rounded-full"
                  >
                    {course.isPremium ? "Premium" : "Free"}
                  </Tag>
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mt-12 mb-6">
          Topics
        </h2>
        <Table
          columns={topicColumns}
          dataSource={course.topics || []}
          rowKey="id"
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpandedRowsChange: (keys) => setExpandedRowKeys(keys),
            expandIcon: () => null,
          }}
          pagination={false}
          className="custom-table rounded-2xl overflow-hidden"
          rowClassName="hover:bg-indigo-50 transition-colors duration-300"
        />
      </div>
    </div>
  );
};

export default CourseDetailPage;
