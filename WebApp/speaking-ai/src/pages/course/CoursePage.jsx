import React from "react";
import useCourseList from "../../hooks/useCourseList";
import CourseTable from "../../components/course/CourseTable";
import { useNavigate } from "react-router-dom";
import CourseEditForm from "../../components/course/CourseEditForm";

const CoursePage = () => {
  const {
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
  } = useCourseList();
  const navigate = useNavigate();

  const onView = (id) => navigate(`/courses/${id}/details`);
  const onEdit = (id) => setEditCourseId(id);
  const onCreate = () => navigate("/courses/create");
  const onDelete = handleDelete;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <CourseTable
        courses={courses}
        loading={loading}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        onCreate={onCreate}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />
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
