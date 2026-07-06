import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Leaf {
  id: number;
  x: number;
  rotation: number;
  duration: number;
  delay: number;
  color: string;
  size: number;
}

interface FallingLeavesProps {
  trigger: number;
}

const leafColors = [
  '#D4C4B0',
  '#C9956A',
  '#6B7456',
  '#CC8855',
  '#B8885A',
  '#D4A574',
  '#C5AA83',
  '#BFA992'
];

function generateLeaf(id: number): Leaf {
  return {
    id,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 0.5,
    color: leafColors[Math.floor(Math.random() * leafColors.length)],
    size: 20 + Math.random() * 20
  };
}

export function FallingLeaves({ trigger }: FallingLeavesProps) {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newLeaves = Array.from({ length: 12 }, (_, i) => generateLeaf(Date.now() + i));
      setLeaves(newLeaves);

      const timer = setTimeout(() => {
        setLeaves([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{
              y: -100,
              x: `${leaf.x}vw`,
              rotate: leaf.rotation,
              opacity: 0
            }}
            animate={{
              y: '100vh',
              x: `${leaf.x + (Math.random() - 0.5) * 20}vw`,
              rotate: leaf.rotation + 360 * 2,
              opacity: [0, 1, 1, 0.5, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              ease: 'easeInOut'
            }}
            className="absolute"
            style={{ left: 0, top: 0 }}
          >
            <svg
              width={leaf.size}
              height={leaf.size * 1.2}
              viewBox="0 0 100 120"
              fill={leaf.color}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            >
              <motion.path
                d="M50 5 Q70 25 80 55 Q75 85 50 115 Q40 90 35 55 Q40 25 50 5 Z M50 5 Q35 20 25 50 Q30 60 40 70 M50 5 Q65 20 75 50 Q70 60 60 70"
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
