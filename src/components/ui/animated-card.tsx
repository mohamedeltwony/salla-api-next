"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-lg border border-border bg-muted/50 p-6 shadow-lg backdrop-blur-sm",
        "hover:shadow-xl hover:border-primary/50 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}