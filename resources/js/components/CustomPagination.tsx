import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

interface CustomPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  showPerPageOptions?: boolean;
  perPageOptions?: number[];
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export default function CustomPagination({
  pagination,
  onPageChange,
  onPerPageChange,
  showPerPageOptions = false,
  perPageOptions = [5, 10, 15, 20, 25, 50],
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className
}: CustomPaginationProps) {
  const { current_page, last_page, per_page, total, from, to } = pagination;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    if (last_page <= maxVisiblePages) {
      return Array.from({ length: last_page }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, current_page - half);
    let end = Math.min(last_page, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 1;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < last_page;

  // Calculate display info
  const displayFrom = from || ((current_page - 1) * per_page) + 1;
  const displayTo = to || Math.min(current_page * per_page, total);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      {/* Results Info */}
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{displayFrom}</span> to{' '}
          <span className="font-medium text-foreground">{displayTo}</span> of{' '}
          <span className="font-medium text-foreground">{total}</span> results
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Per Page Selector */}
        {showPerPageOptions && onPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select value={per_page.toString()} onValueChange={(value) => onPerPageChange(parseInt(value))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
        )}

        {/* Pagination Controls */}
        {last_page > 1 && (
          <div className="flex items-center gap-1">
            {/* First Page */}
            {showFirstLast && current_page > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                className="h-8 w-8 p-0"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Previous Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(current_page - 1)}
              disabled={current_page <= 1}
              className="h-8 w-8 p-0"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Left Ellipsis */}
            {showLeftEllipsis && (
              <div className="flex items-center justify-center h-8 w-8">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            {/* Page Numbers */}
            {visiblePages.map((page) => (
              <Button
                key={page}
                variant={page === current_page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 p-0"
                title={`Page ${page}`}
              >
                {page}
              </Button>
            ))}

            {/* Right Ellipsis */}
            {showRightEllipsis && (
              <div className="flex items-center justify-center h-8 w-8">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            {/* Next Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(current_page + 1)}
              disabled={current_page >= last_page}
              className="h-8 w-8 p-0"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last Page */}
            {showFirstLast && current_page < last_page && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(last_page)}
                className="h-8 w-8 p-0"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
