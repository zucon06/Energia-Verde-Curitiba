import React from 'react';

interface SkeletonProps {
  className?: string;
  isCircle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', isCircle = false }) => {
  const shapeClass = isCircle ? 'rounded-full' : '';
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${shapeClass} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;