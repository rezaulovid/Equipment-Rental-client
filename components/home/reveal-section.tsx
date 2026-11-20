"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export function RevealSection({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
