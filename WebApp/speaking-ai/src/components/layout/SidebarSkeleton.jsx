import React from "react";
import { Skeleton } from "antd";

const SidebarSkeleton = () => (
  <div className="h-screen fixed left-0 top-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-40">
    <div className="p-4">
      <Skeleton active title={{ width: "60%" }} paragraph={false} />
    </div>
    <nav className="mt-6 space-y-1 px-2">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="flex items-center p-3">
          <Skeleton avatar active paragraph={false} className="w-full" />
        </div>
      ))}
    </nav>
    <div className="absolute bottom-0 w-full p-4">
      <Skeleton avatar active paragraph={false} className="w-full" />
    </div>
  </div>
);

export default SidebarSkeleton;
