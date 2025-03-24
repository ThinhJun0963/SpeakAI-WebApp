import React, { useState, useEffect, useCallback, useRef } from "react";
import { courseApi } from "../../api/axiosInstance";
import { Table, Button, Input, Modal, Tag, Select } from "antd";
import { Plus, Search, Edit, Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import CourseEditForm from "./../../components/course/CourseEditForm";

const { Option } = Select;

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCourse, setViewCourse] = useState(null);
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
          title: "Lỗi",
          content: "Không tải được danh sách khóa học.",
          onOk: () => navigate(-1),
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (isInitialFetch.current) {
      fetchCourses();
    }
  }, [fetchCourses]);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc chắn?",
      content: "Hành động này không thể hoàn tác.",
      onOk: async () => {
        setLoading(true);
        try {
          await courseApi.delete(id);
          fetchCourses(true);
        } catch (error) {
          Modal.error({ title: "Lỗi", content: "Không thể xóa khóa học." });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    try {
      const detail = await courseApi.getDetails(id);
      console.log("Dữ liệu từ GET /courses/{id} (View):", detail);
      setViewCourse(detail);
    } catch (error) {
      Modal.error({
        title: "Lỗi",
        content: "Không tải được chi tiết khóa học.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditCourseId(id);
  };

  const handleEditSuccess = () => {
    setEditCourseId(null);
    fetchCourses(true);
  };

  const getFreeStatus = (record) => {
    return record.isFree == true;
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "courseName",
      key: "courseName",
      filters: courses.map((course) => ({
        text: course.courseName,
        value: course.courseName,
      })),
      onFilter: (value, record) => record.courseName === value,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      filters: courses.map((course) => ({
        text: course.description,
        value: course.description,
      })),
      onFilter: (value, record) => record.description === value,
    },
    {
      title: "Điểm tối đa",
      dataIndex: "maxPoint",
      key: "maxPoint",
      filters: [...new Set(courses.map((course) => course.maxPoint))].map(
        (point) => ({
          text: point,
          value: point,
        })
      ),
      onFilter: (value, record) => record.maxPoint === value,
    },
    {
      title: "Cấp độ",
      dataIndex: "levelId",
      key: "levelId",
      render: (id) =>
        ["", "Beginner", "Intermediate", "Advanced"][id] || "Không xác định",
      filters: [
        { text: "Beginner", value: 1 },
        { text: "Intermediate", value: 2 },
        { text: "Advanced", value: 3 },
      ],
      onFilter: (value, record) => record.levelId === value,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <>
          {getFreeStatus(record) ? <Tag color="green">Miễn phí</Tag> : null}
          {record.isPremium && <Tag color="orange">Premium</Tag>}
        </>
      ),
      filters: [
        { text: "Miễn phí", value: "isFree" },
        { text: "Premium", value: "isPremium" },
      ],
      onFilter: (value, record) =>
        value === "isFree" ? getFreeStatus(record) : record.isPremium,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<Eye />}
            onClick={() => handleViewDetails(record.id)}
            className="border-none hover:bg-gray-100"
            disabled={loading}
          />
          <Button
            icon={<Edit />}
            onClick={() => handleEdit(record.id)}
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
      <div className="flex flex-row justify-between items-center mb-6 space-x-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Quản lý khóa học
        </h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Tìm kiếm khóa học..."
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/courses/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            disabled={loading}
          >
            Tạo khóa học
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
          className="border rounded-lg overflow-hidden"
          loading={loading}
        />
      ) : (
        <div className="text-center py-10 text-gray-500">
          Không tìm thấy khóa học nào.
        </div>
      )}

      {viewCourse && (
        <Modal
          title={viewCourse.courseName}
          open={!!viewCourse}
          onCancel={() => setViewCourse(null)}
          footer={null}
          width={800}
          className="rounded-lg"
        >
          <div className="space-y-4 p-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Mô tả:</strong>{" "}
              {viewCourse.description || "Không có mô tả"}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Điểm tối đa:</strong>{" "}
              {viewCourse.maxPoint || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Cấp độ:</strong>{" "}
              {["", "Beginner", "Intermediate", "Advanced"][
                viewCourse.levelId
              ] || "Không xác định"}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Miễn phí:</strong>{" "}
              {getFreeStatus(viewCourse) ? "Có" : "Không"}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Premium:</strong>{" "}
              {viewCourse.isPremium ? "Có" : "Không"}
            </p>
            <h3 className="mt-4 font-semibold text-lg">Chủ đề:</h3>
            <div className="grid grid-cols-1 gap-4">
              {viewCourse.topics?.length > 0 ? (
                viewCourse.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm"
                  >
                    <p className="font-medium text-gray-800">
                      {topic.topicName || "Chưa đặt tên"}{" "}
                      <span className="text-gray-500">
                        (Điểm tối đa: {topic.maxPoint || "N/A"})
                      </span>
                    </p>
                    <ul className="ml-4 list-disc text-gray-600">
                      {topic.exercises?.length > 0 ? (
                        topic.exercises.map((exercise) => (
                          <li key={exercise.id}>
                            {exercise.content || "Không có nội dung"}{" "}
                            <span className="text-gray-400">
                              (Điểm: {exercise.maxPoint || "N/A"})
                            </span>
                          </li>
                        ))
                      ) : (
                        <li>Không có bài tập</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Không có chủ đề nào</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {editCourseId && (
        <CourseEditForm
          courseId={editCourseId}
          courseData={courses.find((course) => course.id === editCourseId)}
          visible={!!editCourseId}
          onCancel={() => setEditCourseId(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default CoursePage;
