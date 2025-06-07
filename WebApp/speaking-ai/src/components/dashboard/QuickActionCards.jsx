import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BookOpen, Tag, BarChart2, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@mui/material";

const QuickActionCards = () => {
  const actions = [
    {
      icon: Users,
      title: "Manage Courses",
      description: "Create and edit course content",
      path: "/courses",
      color: "blue",
    },
    {
      icon: Tag,
      title: "Handle Vouchers",
      description: "Add or modify discount vouchers",
      path: "/vouchers",
      color: "purple",
    },
    {
      icon: BookOpen,
      title: "New Course",
      description: "Start creating a new course",
      path: "/courses/create",
      color: "green",
    },
    {
      icon: PlusCircle,
      title: "New Voucher",
      description: "Create a new promotional voucher",
      path: "/vouchers/create",
      color: "orange",
    },
  ];

  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
    initial: { y: 0, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  };

  const iconVariants = {
    hover: { rotate: 360, scale: 1.2, transition: { duration: 0.5 } },
    initial: { rotate: 0, scale: 1 },
  };

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
          >
            <Card className="border border-gray-200 overflow-hidden">
              <CardContent className="p-6">
                <motion.div
                  variants={iconVariants}
                  className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-${action.color}-50`}
                >
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <Link
                  to={action.path}
                  className={`text-sm font-medium text-${action.color}-600 hover:text-${action.color}-800 transition-colors duration-300`}
                >
                  Take Action →
                </Link>
              </CardContent>
              <div className={`h-1 w-full bg-${action.color}-500`}></div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QuickActionCards;
