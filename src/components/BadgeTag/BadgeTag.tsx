import React from 'react';
import { BadgeTagProps } from '../../types';
import styles from './BadgeTag.module.css';

const BadgeTag: React.FC<BadgeTagProps> = ({ text, variant = 'primary' }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {text}
    </span>
  );
};

export default BadgeTag;
