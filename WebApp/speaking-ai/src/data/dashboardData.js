// src/data/dashboardData.js
import {
  Users,
  BookOpen,
  MessageSquare,
  Activity,
  BarChart2,
  Database,
  Shield,
  Settings,
} from "lucide-react";

// User statistics data
export const userStats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    icon: Users,
    color: "blue",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    borderColor: "border-blue-100",
  },
  {
    title: "Active Sessions",
    value: "342",
    change: "+8.2%",
    icon: MessageSquare,
    color: "green",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
    borderColor: "border-green-100",
  },
  {
    title: "Lesson Completions",
    value: "5,321",
    change: "+15.3%",
    icon: BookOpen,
    color: "purple",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
    borderColor: "border-purple-100",
  },
  {
    title: "Feedback Reports",
    value: "128",
    change: "-2.4%",
    icon: Activity,
    color: "orange",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "border-orange-100",
  },
];

// Recent user activity data
export const recentActivity = [
  {
    id: 1,
    user: "Emma Thompson",
    action: "Completed conversation practice",
    scenario: "Job Interview",
    time: "10 minutes ago",
    proficiency: "Intermediate",
  },
  {
    id: 2,
    user: "Liu Wei",
    action: "Received pronunciation feedback",
    scenario: "Restaurant Ordering",
    time: "25 minutes ago",
    proficiency: "Beginner",
  },
  {
    id: 3,
    user: "Carlos Rodriguez",
    action: "Reached achievement milestone",
    scenario: "Travel Conversations",
    time: "1 hour ago",
    proficiency: "Advanced",
  },
  {
    id: 4,
    user: "Sophia Ahmed",
    action: "Reported technical issue",
    scenario: "Business Meeting",
    time: "2 hours ago",
    proficiency: "Intermediate",
  },
];

// Navigation items (if needed)
export const navItems = [
  { name: "Dashboard", icon: BarChart2, isActive: true },
  { name: "User Management", icon: Users },
  { name: "Content Management", icon: BookOpen },
  { name: "System Data", icon: Database },
  { name: "Reports & Statistics", icon: Activity },
  { name: "Security & Access", icon: Shield },
  { name: "Settings", icon: Settings },
];
