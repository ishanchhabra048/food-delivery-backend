import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      iconRight: IconRight,
      iconLeft: IconLeft,
      to,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-gradient-primary text-white font-semibold hover:opacity-95 shadow-sm hover:shadow-glow hover:-translate-y-0.5",
      secondary:
        "bg-gradient-emerald text-white font-semibold hover:opacity-95 shadow-sm hover:-translate-y-0.5",
      outline:
        "border-2 border-border bg-surface text-fg font-semibold hover:bg-surface-muted hover:border-primary/40",
      ghost:
        "text-fg-2 font-medium hover:text-fg hover:bg-surface-muted",
      danger:
        "bg-danger text-white font-semibold hover:bg-red-600 shadow-sm",
      accent:
        "bg-gradient-accent text-white font-semibold shadow-sm hover:shadow-glow-accent hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded-sm gap-1.5 h-8",
      md: "text-sm px-4 py-2.5 rounded-md gap-2 h-10",
      lg: "text-base px-6 py-3 rounded-lg gap-2.5 h-12 font-semibold",
      icon: "h-10 w-10 p-0 rounded-md",
      "icon-sm": "h-8 w-8 p-0 rounded-sm",
    };

    const combinedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && IconLeft && <IconLeft className="w-4 h-4" />}
        <span>{children}</span>
        {!loading && IconRight && <IconRight className="w-4 h-4" />}
      </>
    );

    if (to) {
      return (
        <Link to={to} className={combinedClassName} ref={ref} {...props}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
