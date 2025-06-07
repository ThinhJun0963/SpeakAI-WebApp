import React from "react";
import { Button } from "antd";
import { Skeleton } from "antd";

const CourseHeader = ({ onBack, onEdit, loading }) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 1 }} className="mb-4" />;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <Button onClick={onBack} className="mb-2 sm:mb-0" disabled={loading}>
        Back
      </Button>
      <Button
        type="primary"
        icon={<Edit />}
        onClick={onEdit}
        disabled={loading}
      >
        Edit Course
      </Button>
    </div>
  );
};

export default CourseHeader;
