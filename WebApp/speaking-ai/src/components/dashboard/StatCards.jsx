import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Tag, CheckCircle, DollarSign } from "lucide-react";
import { Card, CardContent } from "@mui/material";

const StatCards = ({ courses, vouchers }) => {
  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      change: courses.length > 0 ? `+${Math.round(courses.length / 10)}` : "0",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-500",
      icon: BookOpen,
      iconColor: "text-white",
    },
    {
      title: "Active Vouchers",
      value: vouchers.filter((v) => v.isActive).length,
      change: vouchers.some((v) => v.isActive) ? "+1" : "0",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-500",
      icon: Tag,
      iconColor: "text-white",
    },
    {
      title: "Active Courses",
      value: courses.filter((c) => c.isActive).length,
      change: courses.some((c) => c.isActive)
        ? `+${Math.round(courses.length / 20)}`
        : "0",
      borderColor: "border-green-200",
      bgColor: "bg-green-500",
      icon: CheckCircle,
      iconColor: "text-white",
    },
    {
      title: "Total Discounts",
      value:
        vouchers.reduce((sum, v) => sum + (v.discountPercentage || 0), 0) + "%",
      change:
        vouchers.length > 0 ? `+${Math.round(vouchers.length * 5)}%` : "0%",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-500",
      icon: DollarSign,
      iconColor: "text-white",
    },
  ];

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    initial: { scale: 1 },
  };

  const textVariants = {
    hover: { color: "#2563eb", transition: { duration: 0.3 } },
    initial: { color: "#111827" },
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Key Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
          >
            <Card className={`border ${stat.borderColor} overflow-hidden`}>
              <CardContent className="p-0">
                <div className="flex items-center p-5">
                  <motion.div
                    className={`${stat.bgColor} p-3 rounded-lg`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </motion.div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-0.5">
                      {stat.title}
                    </p>
                    <motion.h3
                      variants={textVariants}
                      className="text-2xl font-bold text-gray-900"
                    >
                      {stat.value}
                    </motion.h3>
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
                <motion.div
                  className={`h-1 w-full ${stat.bgColor}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatCards;
