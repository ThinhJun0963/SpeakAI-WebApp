// src/hooks/useCourseList.js
import { useState, useEffect, useCallback, useRef } from "react";
import { Modal } from "antd";
import useCourseApi from "./useCourseApi";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";

const useCourseList = () => {
  const { getAll: fetchAllCourses, deleteCourse } = useCourseApi(); // Destructure getAll method
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editCourseId, setEditCourseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const isInitialFetch = useRef(true);

  const fetchCourses = useCallback(
    async (forceFetch = false) => {
      if (!forceFetch && !isInitialFetch.current) return;
      setLoading(true);
      try {
        const data = await fetchAllCourses(); // Use the getAll method from useCourseApi
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
    [fetchAllCourses, navigate] // Update dependency array
  );

  useEffect(() => {
    if (isInitialFetch.current) fetchCourses();
  }, [fetchCourses]);

  const handleSearch = debounce((value) => setSearchTerm(value), 300);

  const handleDelete = async (id, courseName) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `This action will delete the course "${courseName}". This cannot be undone.`,
      onOk: async () => {
        setLoading(true);
        try {
          await deleteCourse(id);
          fetchCourses(true);
          Modal.success({
            title: "Success",
            content: "Course deleted successfully.",
          });
        } catch (error) {
          Modal.error({ title: "Error", content: "Failed to delete course." });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    courses,
    loading,
    searchTerm,
    editCourseId,
    currentPage,
    pageSize,
    paginatedCourses,
    handleSearch,
    setEditCourseId,
    handleDelete,
    setCurrentPage,
    setPageSize,
    fetchCourses,
  };
};

export default useCourseList;
