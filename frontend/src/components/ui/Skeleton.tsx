interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle";
}

export default function Skeleton({
  className = "",
  variant = "text",
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded-lg";

  const variantClasses = {
    text: "h-4 w-full",
    card: "h-32 w-full rounded-xl",
    circle: "h-12 w-12 rounded-full",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}