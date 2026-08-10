import React from 'react';

const SkeletonLoader = ({ type = "product", count = 4 }) => {
  const skeletons = Array(count).fill(0);

  if (type === "product") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden animate-pulse">
            <div className="h-48 bg-neutral-200 w-full" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-neutral-200 rounded w-1/4" />
                <div className="h-8 bg-neutral-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex gap-4 animate-pulse">
            <div className="w-16 h-16 bg-neutral-200 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1 py-1">
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
              <div className="h-3 bg-neutral-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default SkeletonLoader;
