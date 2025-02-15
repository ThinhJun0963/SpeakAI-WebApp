import React from "react";
import { Card, CardContent } from "../ui/Card";

const ActivityTable = ({ recentActivity }) => {
  const getProficiencyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
      case "Intermediate":
        return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20";
      case "Advanced":
        return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Recent User Activity
      </h2>
      <Card className="overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-200">
                    User
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-200">
                    Action
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-200">
                    Scenario
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-200">
                    Time
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500 border-b border-gray-200">
                    Proficiency
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr
                    key={activity.id}
                    className="transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {activity.user.charAt(0)}
                        </div>
                        <span className="ml-2">{activity.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-100">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-100">
                      {activity.scenario}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 border-b border-gray-100">
                      {activity.time}
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-gray-100">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full 
                        transition-all duration-200 hover:shadow-sm
                        ${getProficiencyColor(activity.proficiency)}`}
                      >
                        {activity.proficiency}
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
