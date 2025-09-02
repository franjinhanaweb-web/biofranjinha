import React, { useEffect, useRef } from 'react';
import { MarqueeProps } from '../../types';
import styles from './Marquee.module.css';

const Marquee: React.FC<MarqueeProps> = ({ text, separator = '•' }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      marquee.style.animation = 'none';
      return;
    }

    // Clone content for seamless loop
    const content = marquee.innerHTML;
    marquee.innerHTML = content + separator + content;
  }, [text, separator]);

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marquee} ref={marqueeRef}>
        <span className={styles.marqueeText}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default Marquee;
