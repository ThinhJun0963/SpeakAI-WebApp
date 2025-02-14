import React from "react";
import { Calendar, DollarSign, Users, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const stats = [
  {
    title: "Total Bookings",
    value: "1,234",
    change: "+12.5%",
    icon: Calendar,
    color: "blue",
  },
  {
    title: "Revenue",
    value: "$52,345",
    change: "+8.2%",
    icon: DollarSign,
    color: "green",
  },
  {
    title: "New Customers",
    value: "321",
    change: "+15.3%",
    icon: Users,
    color: "purple",
  },
  {
    title: "Pending Bookings",
    value: "42",
    change: "-2.4%",
    icon: Clock,
    color: "orange",
  },
];

const BookingStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <CardContent className="flex items-center p-6">
            <div
              className={`bg-${stat.color}-100 p-3 rounded-full transition-transform duration-300 hover:rotate-12`}
            >
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 transition-all duration-300 hover:text-blue-600">
                {stat.value}
              </h3>
              <p
                className={`text-sm ${
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change} vs last month
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingStats;
