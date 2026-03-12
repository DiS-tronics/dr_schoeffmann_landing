import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '../../lib/utils'

export function HoverEffect({ items, className }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-2', className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/10 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <Card>
            {item.icon && (
              <div className="w-20 h-20 relative mb-4">
                <img src={item.icon} alt={item.title} className="object-contain w-full h-full" />
              </div>
            )}
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  )
}

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-2xl h-full w-full p-6 overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow flex flex-col items-center text-center border border-transparent group-hover:border-primary/20',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn('text-lg font-semibold text-primary mt-2 mb-2', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn('text-gray-600 text-sm leading-relaxed', className)}>
      {children}
    </p>
  )
}
