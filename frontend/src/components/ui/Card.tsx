import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingClasses = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
}: CardProps) {
  const Component = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: { y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" },
        transition: { duration: 0.15 },
      }
    : {};

  return (
    <Component
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        ${paddingClasses[padding]}
        ${hover ? "cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}