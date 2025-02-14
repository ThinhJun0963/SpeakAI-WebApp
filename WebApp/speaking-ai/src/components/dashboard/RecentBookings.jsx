import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const bookings = [
  {
    id: 1,
    customer: "John Doe",
    type: "Hotel",
    date: "2024-02-10",
    status: "Confirmed",
    amount: "$250",
  },
  {
    id: 2,
    customer: "Jane Smith",
    type: "Flight",
    date: "2024-02-09",
    status: "Pending",
    amount: "$420",
  },
  {
    id: 3,
    customer: "Mike Johnson",
    type: "Car",
    date: "2024-02-08",
    status: "Completed",
    amount: "$85",
  },
  {
    id: 4,
    customer: "Sarah Wilson",
    type: "Tour",
    date: "2024-02-07",
    status: "Confirmed",
    amount: "$150",
  },
];

const RecentBookings = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mt-6 transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="transition-colors duration-300 hover:text-blue-600">
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-4 border-b transition-colors duration-300 hover:text-blue-600">
                  Customer
                </th>
                <th className="p-4 border-b transition-colors duration-300 hover:text-blue-600">
                  Type
                </th>
                <th className="p-4 border-b transition-colors duration-300 hover:text-blue-600">
                  Date
                </th>
                <th className="p-4 border-b transition-colors duration-300 hover:text-blue-600">
                  Status
                </th>
                <th className="p-4 border-b transition-colors duration-300 hover:text-blue-600">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-all duration-300 hover:bg-blue-50"
                >
                  <td className="p-4 border-b">{booking.customer}</td>
                  <td className="p-4 border-b">{booking.type}</td>
                  <td className="p-4 border-b">{booking.date}</td>
                  <td className="p-4 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-sm 
                      transition-all duration-300 hover:scale-105 hover:shadow-md
                      ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 border-b">{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
