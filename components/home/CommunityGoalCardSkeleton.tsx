import React from 'react';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

const CommunityGoalCardSkeleton: React.FC = () => {
    return (
        <Card>
            <div className="flex items-center mb-3">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-5 w-48 rounded-md ml-3" />
            </div>
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-3/4 rounded-md mb-4" />
            
            <div>
                <div className="flex justify-between items-baseline text-sm mb-1">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                </div>
                <Skeleton className="w-full h-2.5 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-md mx-auto mt-3" />
            </div>
        </Card>
    );
};

export default CommunityGoalCardSkeleton;