import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="relative card w-full md:w-[320px] bg-neutral shadow-xl mb-5 mx-1 group overflow-hidden">
      <div className="w-full md:w-[320px] h-52 skeleton-loader" />
      <div className="flex flex-col justify-between items-center card-body">
        <div className="w-full">
          <div className="text-white h-10 w-3/4 skeleton-loader rounded-md" />
          <div className="h-[72px] w-full skeleton-loader rounded-md" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="text-green-600 text-lg h-8 w-[95px] skeleton-loader rounded-md" />
            <div className="h-8 skeleton-loader grow rounded-lg pl-3 py-1" />
          </div>
          <div className="rounded-md w-full h-12 skeleton-loader" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
