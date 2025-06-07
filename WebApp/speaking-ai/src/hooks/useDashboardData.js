import React from "react";
import { Card, CardContent } from "@mui/material";
import { getStatusStyle } from "../utils/statusUtils";

const ActivityTable = ({ recentActivity }) => {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Recent Course Activity
      </h2>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Course
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Action
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Topic
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {activity.courseName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {activity.scenario}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ActivityTable;
