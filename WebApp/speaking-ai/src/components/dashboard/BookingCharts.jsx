import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const bookingData = [
  { month: "Jan", bookings: 400, revenue: 8000 },
  { month: "Feb", bookings: 300, revenue: 6000 },
  { month: "Mar", bookings: 600, revenue: 12000 },
  { month: "Apr", bookings: 800, revenue: 16000 },
  { month: "May", bookings: 500, revenue: 10000 },
  { month: "Jun", bookings: 700, revenue: 14000 },
];

const bookingTypeData = [
  { name: "Hotel", value: 400 },
  { name: "Flight", value: 300 },
  { name: "Car", value: 200 },
  { name: "Tour", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const BookingCharts = () => {
  const [activeChart, setActiveChart] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card
        className={`transition-all duration-300 hover:shadow-xl ${
          activeChart === "line" ? "scale-105" : ""
        }`}
        onMouseEnter={() => setActiveChart("line")}
        onMouseLeave={() => setActiveChart(null)}
      >
        <CardHeader>
          <CardTitle className="transition-colors duration-300 hover:text-blue-600">
            Booking Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`transition-all duration-300 hover:shadow-xl ${
          activeChart === "pie" ? "scale-105" : ""
        }`}
        onMouseEnter={() => setActiveChart("pie")}
        onMouseLeave={() => setActiveChart(null)}
      >
        <CardHeader>
          <CardTitle className="transition-colors duration-300 hover:text-blue-600">
            Booking Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCharts;
