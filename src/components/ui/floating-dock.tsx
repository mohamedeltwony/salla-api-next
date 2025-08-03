"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingDockProps {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  className?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
        "flex items-center gap-2 p-2 rounded-full",
        "bg-background/80 backdrop-blur-md border border-border shadow-lg",
        className
      )}
    >
      {items.map((item, _) => (
        <motion.button
          key={item.title}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-3 rounded-full transition-colors",
            "hover:bg-primary/20 hover:text-primary",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          onClick={item.onClick}
          title={item.title}
        >
          {item.icon}
        </motion.button>
      ))}
    </motion.div>
  );
}