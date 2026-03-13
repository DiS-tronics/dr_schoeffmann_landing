import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion'
import { cn } from '../../lib/utils'

/**
 * Aceternity-style WobbleCard — 3-D perspective tilt following the cursor.
 * Uses Framer Motion motion values + springs (zero React re-renders on mousemove).
 *
 * Props:
 *  containerClassName  – extra classes on the outer wrapper (use for gradient bg)
 *  className           – extra classes on the inner content div
 *  children
 */
export function WobbleCard({ containerClassName, className, children }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const scale = useSpring(1, { stiffness: 300, damping: 30 })
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseEnter() { scale.set(1.02) }
  function handleMouseLeave() { rawX.set(0); rawY.set(0); scale.set(1) }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800 }}
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-default select-none',
        containerClassName
      )}
    >
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className={cn('relative z-10 h-full w-full p-8', className)}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
