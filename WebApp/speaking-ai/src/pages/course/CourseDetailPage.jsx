import React from "react";
import { motion } from "framer-motion";
import useCourseDetail from "../../hooks/useCourseDetail";
import CourseHeader from "../../components/course/CourseHeader";
import CourseInfo from "../../components/course/CourseInfo";
import TopicPanel from "../../components/course/TopicPanel";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, loading, parseExerciseContent } = useCourseDetail(id);

  if (!course && !loading)
    return <div className="text-center py-10">Course not found</div>;

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CourseHeader
        onBack={() => navigate(-1)}
        onEdit={() => navigate(`/courses/edit/${course?.id}`)}
        loading={loading}
      />
      <h1 className="text-3xl font-bold mb-4">{course?.courseName}</h1>
      <CourseInfo course={course} loading={loading} />
      <TopicPanel
        topics={course?.topics || []}
        parseExerciseContent={parseExerciseContent}
        loading={loading}
      />
    </motion.div>
  );
};

export default CourseDetailPage;
