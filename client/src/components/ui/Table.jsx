import React from "react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { cn } from "../../lib/utils";

export const Table = ({
  columns = [], // [{ header, accessor, className, render: (row) => node }]
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There is no data to display currently.",
  className,
}) => {
  return (
    <div className={cn("w-full overflow-x-auto rounded-lg border border-border bg-surface shadow-sm", className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-muted border-b border-border text-xs font-semibold text-fg-2 uppercase tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn("px-4 py-3.5 whitespace-nowrap", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx} className="hover:bg-surface-muted/30">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="px-4 py-4">
                    <Skeleton className="h-4 w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8">
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  className="border-0 bg-transparent py-4"
                />
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr
                key={row._id || rIdx}
                className="hover:bg-surface-muted/40 transition-colors"
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={cn("px-4 py-3.5 text-fg", col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : typeof col.accessor === "function"
                      ? col.accessor(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
