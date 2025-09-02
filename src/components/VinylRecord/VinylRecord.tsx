import React from 'react';
import { VinylRecordProps } from '../../types';
import styles from './VinylRecord.module.css';

const VinylRecord: React.FC<VinylRecordProps> = ({
  coverImage,
  vinylImage,
  labelImage,
  onClick,
  isSpinning = true,
  className,
  coverText
}) => {
  return (
    <div 
      className={`${styles.wrap} ${className || ''}`}
      onClick={onClick}
    >
      <div className={styles.album}>
        <div 
          className={styles.cover}
          style={{ 
            backgroundImage: coverImage ? `url(${coverImage})` : undefined,
            backgroundSize: coverImage ? '100% 100%' : undefined
          }}
        >
          <div className={styles.print}></div>
          {coverImage && (
            <div className={`${styles.coverText} ${
              coverText?.toLowerCase().includes('classic') ? styles.classic :
              coverText?.toLowerCase().includes('prestige') ? styles.prestige :
              coverText?.toLowerCase().includes('girlfriend') ? styles.girlfriend : ''
            }`}>
              {coverText?.toLowerCase().includes('girlfriend') ? 'Girlfriend Experience' : (coverText || 'Classic')}
            </div>
          )}
        </div>
        <div className={`${styles.vinyl} ${isSpinning ? styles.spinning : ''}`}>
          <div 
            className={styles.vinylPrint}
            style={{ backgroundImage: `url(${labelImage})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default VinylRecord;
