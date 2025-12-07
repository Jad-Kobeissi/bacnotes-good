import { motion } from "motion/react";
export default function Loading({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className={`${className}`}
    >
      <h1>Loading...</h1>
    </motion.div>
  );
}
