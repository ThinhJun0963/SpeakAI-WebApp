// src/routes.js
import React from "react";

const routes = [
  { path: "/login", component: () => import("./pages/auth/LoginPage") },
  { path: "/sign-up", component: () => import("./pages/auth/SignUpPage") },
  {
    path: "/forgot-password",
    component: () => import("./pages/auth/ForgotPasswordPage"),
  },
  {
    path: "/",
    component: () => import("./pages/AdminPage"),
    children: [
      { path: "", component: () => import("./pages/DashboardHome") },
      { path: "courses", component: () => import("./pages/course/CoursePage") },
      {
        path: "courses/create",
        component: () => import("./pages/course/CreateCoursePage"),
      },
      {
        path: "courses/edit/:id",
        component: () => import("./components/course/CourseEditForm"),
        wrapper: () => import("./components/course/CourseEditWrapper"), // Assume a wrapper component
      },
      {
        path: "courses/:id/details",
        component: () => import("./pages/course/CourseDetailPage"),
      },
      {
        path: "vouchers",
        component: () => import("./pages/voucher/VoucherPage"),
      },
      {
        path: "vouchers/create",
        component: () => import("./pages/voucher/CreateVoucherPage"),
      },
      {
        path: "vouchers/edit/:id",
        component: () => import("./pages/voucher/VoucherEditPage"),
        wrapper: () => import("./components/voucher/VoucherEditWrapper"), // Assume a wrapper component
      },
      {
        path: "transactions",
        component: () => import("./pages/transaction/TransactionPage"),
      },
      {
        path: "*",
        component: () =>
          import("react-router-dom").then((mod) => ({ default: mod.Navigate })),
        props: { to: "/" },
      },
    ],
  },
];

export default routes;
