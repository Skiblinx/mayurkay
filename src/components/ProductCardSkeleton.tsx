
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';

const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="relative">
        <Skeleton className="w-full h-48" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default ProductCardSkeleton;
