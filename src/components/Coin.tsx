import React from 'react';
import { motion } from 'motion/react';
import { CoinResult } from '../types';

interface CoinProps {
  result: CoinResult;
  isSpinning: boolean;
}

export const Coin: React.FC<CoinProps> = ({ result, isSpinning }) => {
  return (
    <motion.div
      animate={isSpinning ? {
        rotateY: [0, 360, 720, 1080],
        y: [0, -50, 0],
      } : {
        rotateY: result === 'H' ? 0 : 180,
      }}
      transition={{
        duration: isSpinning ? 0.6 : 0.3,
        ease: "easeInOut",
      }}
      className="w-14 h-14 sm:w-16 sm:h-16 relative preserve-3d cursor-default"
    >
      {/* Front (Head - 正) */}
      <div className={`absolute inset-0 backface-hidden rounded-full border-4 border-amber-600 bg-amber-100 flex items-center justify-center shadow-lg`}>
        <span className="text-amber-800 font-bold text-xl sm:text-2xl">正</span>
      </div>
      {/* Back (Tail - 反) */}
      <div className={`absolute inset-0 backface-hidden rounded-full border-4 border-amber-600 bg-amber-50 flex items-center justify-center shadow-lg transform rotate-y-180`}>
        <span className="text-amber-700 font-bold text-xl sm:text-2xl">反</span>
      </div>
    </motion.div>
  );
};
