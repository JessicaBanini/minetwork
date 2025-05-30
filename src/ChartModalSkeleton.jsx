import React from "react";

const ChartModalSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header skeleton */}
      <div className="h-6 bg-[#112240] rounded w-2/3 mx-auto"></div>

      {/* Candlestick chart area skeleton */}
      <div className="h-[300px] bg-[#112240] rounded-md w-full"></div>
    </div>
  );
};

export default ChartModalSkeleton;
