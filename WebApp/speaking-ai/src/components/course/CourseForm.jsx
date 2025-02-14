import React from "react";
import { Input } from "../ui/Input";
import TextArea from "..//ui/TextArea";
import Label from "../ui/Laybel";
import Switch from "../ui/Switch";

const POINT_OPTIONS = [90, 100, 200, 300];

export const CourseForm = ({ courseData, setCourseData, onNext, onCancel }) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>Course Name</Label>
        <Input
          placeholder="Enter course name"
          value={courseData.courseName}
          onChange={(e) =>
            setCourseData((prev) => ({ ...prev, courseName: e.target.value }))
          }
        />
      </div>

      {/* Other form fields as before */}

      <div className="flex justify-between mt-6">
        <button onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!courseData.courseName}
        >
          Next
        </button>
      </div>
    </div>
  );
};
