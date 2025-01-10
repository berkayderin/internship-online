import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ChartSkeleton({ title }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[300px] items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </CardContent>
    </Card>
  );
}
