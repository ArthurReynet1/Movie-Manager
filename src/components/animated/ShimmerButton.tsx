import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export function ShimmerButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
}: ShimmerButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
    secondary: "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500",
    danger: "bg-gradient-to-r from-red-600 via-rose-600 to-pink-600",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${variants[variant]} ${className}`}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          translateX: ["100%", "-100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
