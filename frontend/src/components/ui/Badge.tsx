import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: "solid" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  color = "#3B82F6",
  variant = "solid",
  size = "sm",
  className = "",
}: BadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const style =
    variant === "solid"
      ? {
          backgroundColor: color + "20",
          color: color,
          borderColor: "transparent",
        }
      : {
          backgroundColor: "transparent",
          color: color,
          borderColor: color + "40",
        };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${sizeClasses[size]}
        ${className}
      `}
      style={style}
    >
      {children}
    </span>
  );
}