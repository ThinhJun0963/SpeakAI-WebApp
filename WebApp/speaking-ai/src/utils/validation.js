export const validateCourse = (courseData) => {
  const errors = {};

  if (!courseData.courseName?.trim()) {
    errors.courseName = "Course name is required";
  }

  if (!courseData.description?.trim()) {
    errors.description = "Description is required";
  }

  if (courseData.maxPoint < 0) {
    errors.maxPoint = "Max points cannot be negative";
  }

  if (!courseData.levelId) {
    errors.levelId = "Please select a level";
  }

  if (!courseData.topics?.length) {
    errors.topics = "At least one topic is required";
  }

  return errors;
};
