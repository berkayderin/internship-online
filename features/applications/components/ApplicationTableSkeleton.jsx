import { TableCell, TableRow } from '@/components/ui/table';

export function ApplicationTableSkeleton({ isAdmin }) {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {isAdmin && (
            <TableCell>
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            </TableCell>
          )}
          <TableCell>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          </TableCell>
          <TableCell>
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          </TableCell>
          {isAdmin && (
            <TableCell>
              <div className="flex gap-2">
                <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}
