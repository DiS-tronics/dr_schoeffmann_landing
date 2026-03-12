'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

/**
 * Aceternity-style WobbleCard — 3-D perspective tilt following the cursor.
 *
 * Props:
 *  containerClassName  – extra classes on the outer wrapper (use for gradient bg)
 *  className           – extra classes on the inner content div
 *  children
 */
export function WobbleCard({ containerClassName, className, children }) {
  const containerRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  function handleMouseMove(e) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const relX = (e.clientX - rect.left) / rect.width - 0.5  // -0.5 … 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x: relX, y: relY })
  }

  const rotateX = isHovering ? -mousePos.y * 20 : 0  // tilt up/down
  const rotateY = isHovering ? mousePos.x * 20 : 0   // tilt left/right

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0, y: 0 }) }}
      style={{ perspective: 800 }}
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-default select-none',
        containerClassName
      )}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
          scale: isHovering ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={cn('relative z-10 h-full w-full p-8', className)}
      >
        {/* Shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {children}
      </motion.div>
    </motion.div>
  )
}
