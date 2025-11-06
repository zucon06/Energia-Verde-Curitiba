import React from 'react';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

const ProjectCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="w-full h-40" />
      <div className="p-4 flex flex-col flex-1">
        <div>
            <div className="flex items-center space-x-2 mb-2">
                <Skeleton className="h-8 w-8" isCircle />
                <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>
            <Skeleton className="h-4 w-1/2 rounded-md mb-4" />
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex space-x-2 items-start">
                        <Skeleton className="h-4 w-4" />
                        <div>
                            <Skeleton className="h-3 w-16 rounded-md" />
                            <Skeleton className="h-4 w-12 rounded-md mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-auto">
            <div className="flex justify-between text-sm mb-1">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-8 rounded-md" />
            </div>
            <Skeleton className="w-full h-2.5 rounded-full" />
        </div>
      </div>
    </Card>
  );
};

export default ProjectCardSkeleton;