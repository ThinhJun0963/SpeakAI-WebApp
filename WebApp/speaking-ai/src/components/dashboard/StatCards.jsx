import React from "react";
import { Card, CardContent } from "../ui/Card";

const StatCards = ({ userStats }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Key Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <Card
            key={index}
            className={`group transition-all duration-300 hover:shadow-md border ${stat.borderColor} overflow-hidden`}
          >
            <CardContent className="p-0">
              <div className="flex items-center p-5">
                <div
                  className={`${stat.bgColor} p-3 rounded-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">
                    {stat.title}
                  </p>
                  <h3
                    className={`text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600`}
                  >
                    {stat.value}
                  </h3>
                  <p
                    className={`text-sm font-medium mt-0.5 ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change} vs last month
                  </p>
                </div>
              </div>
              <div className={`h-1 w-full ${stat.bgColor}`}></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default StatCards;
