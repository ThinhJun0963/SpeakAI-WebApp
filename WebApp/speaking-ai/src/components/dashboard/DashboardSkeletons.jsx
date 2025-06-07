import { Skeleton } from "antd";

export const StatCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <Skeleton
        key={index}
        active
        avatar={{ shape: "square", size: "large" }}
        paragraph={false}
        title={{ width: "60%" }}
        className="p-4 bg-white rounded-lg shadow"
      />
    ))}
  </div>
);

export const LearningChartsSkeleton = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <Skeleton active title={false} paragraph={{ rows: 4 }} />
  </div>
);

export const ActivityTableSkeleton = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <Skeleton active title={false} paragraph={{ rows: 5 }} />
  </div>
);

export const QuickActionCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <Skeleton
        key={index}
        active
        avatar={{ shape: "square", size: "large" }}
        paragraph={false}
        title={{ width: "80%" }}
        className="p-4 bg-white rounded-lg shadow"
      />
    ))}
  </div>
);
