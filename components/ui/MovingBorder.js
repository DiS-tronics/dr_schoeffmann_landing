import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

export function MovingBorder({ children, duration = 2000, rx = '30%', ry = '30%', className, containerClassName, ...otherProps }) {
  const pathRef = useRef()
  const progress = useMotionValue(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (length) {
      const pxPerMillisecond = length / duration
      progress.set((time * pxPerMillisecond) % length)
    }
  })

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y)
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <button
      className={cn(
        'relative inline-flex h-16 overflow-hidden rounded-xl p-[1px] focus:outline-none',
        containerClassName
      )}
      {...otherProps}
    >
      <span className="absolute inset-[-1000%] overflow-hidden rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
        >
          <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
        </svg>
        <motion.div
          style={{ position: 'absolute', top: 0, left: 0, display: 'inline-block', transform }}
          className="h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--primary,_#0F5BB5)_40%,_transparent_60%)]"
        />
      </span>
      <span
        className={cn(
          'relative inline-flex h-full w-full items-center justify-center rounded-[calc(0.75rem-1px)] bg-footer-brown text-hero-beige font-bold px-10 py-4 text-lg backdrop-blur-3xl',
          className
        )}
      >
        {children}
      </span>
    </button>
  )
}
