
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';

const CategoryCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="aspect-square">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-6 w-24 mx-auto" />
      </div>
    </Card>
  );
};

export default CategoryCardSkeleton;
