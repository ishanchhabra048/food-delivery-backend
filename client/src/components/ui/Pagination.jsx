import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-4 px-2 text-sm text-fg-2",
        className
      )}
    >
      <span>
        Page <span className="font-semibold text-fg">{currentPage}</span> of{" "}
        <span className="font-semibold text-fg">{totalPages}</span>
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          iconLeft={ChevronLeft}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          iconRight={ChevronRight}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
