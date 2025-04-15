"use client"

import { motion } from "framer-motion"

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}