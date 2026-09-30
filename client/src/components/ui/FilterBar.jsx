import React, { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw, X } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [], // [{ label, value, options: [{ label, value }], onChange }]
  onReset,
  className,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters = filters.some(
    (f) => f.value && f.value !== "all" && f.value !== ""
  ) || Boolean(searchQuery);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            icon={Search}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Desktop Filter Selects */}
        <div className="hidden sm:flex items-center gap-3">
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="bg-surface text-fg text-sm border border-border rounded-md px-3 py-2.5 focus:border-primary focus:outline-none"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {hasActiveFilters && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              iconLeft={RotateCcw}
              className="text-xs"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex sm:hidden justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            iconLeft={SlidersHorizontal}
          >
            Filters {hasActiveFilters && "•"}
          </Button>

          {hasActiveFilters && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-danger"
            >
              Reset All
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filters Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden p-4 rounded-lg bg-surface border border-border space-y-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-fg">Filter Options</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-fg-3 hover:text-fg p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {filters.map((filter, index) => (
            <div key={index} className="space-y-1">
              <label className="text-xs text-fg-2 font-medium">{filter.label}</label>
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full bg-surface-muted text-fg text-sm border border-border rounded-md px-3 py-2 focus:border-primary focus:outline-none"
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
