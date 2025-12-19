import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  blur?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 40,
  once = true,
  blur = false,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { y: 0, x: distance };
      case 'right':
        return { y: 0, x: -distance };
      case 'none':
        return { y: 0, x: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        ...initial,
        filter: blur ? 'blur(10px)' : 'blur(0px)',
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : initial.y,
        x: isInView ? 0 : initial.x,
        filter: isInView ? 'blur(0px)' : blur ? 'blur(10px)' : 'blur(0px)',
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
  distance = 30,
}: StaggerItemProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { y: 0, x: distance };
      case 'right':
        return { y: 0, x: -distance };
      default:
        return { y: distance, x: 0 };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          ...initial,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Counter animation for stats
interface CounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className, duration = 2 }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number and suffix
  const match = value.match(/^([\d.]+)(.*)$/);
  const numericPart = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {numericPart > 0 ? (
            <>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {value}
              </motion.span>
            </>
          ) : (
            value
          )}
        </motion.span>
      ) : (
        value
      )}
    </motion.span>
  );
}