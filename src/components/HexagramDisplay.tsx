import React from 'react';
import { TossResult } from '../types';

interface HexagramDisplayProps {
  tosses: TossResult[];
  title?: string;
}

export const HexagramDisplay: React.FC<HexagramDisplayProps> = ({ tosses, title }) => {
  // Reverse to show from top to bottom (Upper to Lower)
  const displayTosses = [...tosses].reverse();

  return (
    <div className="flex flex-col items-center gap-2">
      {title && <h3 className="text-sm font-medium text-stone-500 mb-2">{title}</h3>}
      <div className="flex flex-col gap-3 w-48">
        {displayTosses.map((toss, idx) => {
          const isYang = toss.value === 7 || toss.value === 9;
          const isChanging = toss.isChanging;
          
          return (
            <div key={6 - idx} className="relative flex items-center justify-center h-4">
              {isYang ? (
                <div className={`w-full h-full bg-stone-800 rounded-sm ${isChanging ? 'bg-red-700' : ''}`} />
              ) : (
                <div className="w-full h-full flex gap-4">
                  <div className={`flex-1 h-full bg-stone-800 rounded-sm ${isChanging ? 'bg-red-700' : ''}`} />
                  <div className={`flex-1 h-full bg-stone-800 rounded-sm ${isChanging ? 'bg-red-700' : ''}`} />
                </div>
              )}
              {isChanging && (
                <div className="absolute -right-6 text-red-700 font-bold">×</div>
              )}
              <div className="absolute -left-8 text-[10px] text-stone-400 font-mono">
                {6 - idx}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
