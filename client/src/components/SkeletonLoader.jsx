import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <div className="w-full h-[600px] bg-soil rounded-3xl grid grid-cols-2 gap-6 p-8 border-b-[12px] border-forest opacity-50">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-forest/10 rounded-2xl border-2 border-moss/10 shimmer relative flex flex-col items-center justify-end pb-8">
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="h-6 w-24 mx-auto bg-forest/20 rounded mb-2"></div>
            <div className="w-full h-2 bg-forest/20 rounded-full overflow-hidden"></div>
          </div>
          <div className="w-24 h-24 rounded-full bg-forest/20 blur-xl"></div>
        </div>
      ))}
    </div>
  );
}
