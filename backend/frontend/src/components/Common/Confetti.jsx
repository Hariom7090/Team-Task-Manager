import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

const Confetti = ({ active, onComplete }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={200}
      recycle={false}
      gravity={0.2}
      colors={['#3b82f6', '#8b5cf6', '#ec489a', '#10b981', '#f59e0b']}
    />
  );
};

export default Confetti;