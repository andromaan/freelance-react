import type React from "react";

interface Props {
  className?: string;
  direction?: "left" | "right" | "up" | "down";
}

const arrowPaths = {
  left: "M15 19l-7-7 7-7",
  right: "M9 19l7-7-7-7",
  up: "M12 15l7-7-7-7",
  down: "M12 9l7 7-7 7",
} as const;

const ArrowIcon: React.FC<Props> = ({
  className = "w-4 h-4",
  direction = "right",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={arrowPaths[direction]}
    />
  </svg>
);

export default ArrowIcon;
