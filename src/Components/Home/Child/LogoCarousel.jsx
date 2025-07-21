import React from 'react';
import styles from './LogoCarousel.module.css';

const logos = [
  '/logo/client-logo-1.png',
  '/logo/client-logo-2.png',
  '/logo/client-logo-3.png',
  '/logo/client-logo-4.png',
  '/logo/client-logo-5.png',
  '/logo/client-logo-1.png', // Repeated for seamless scroll
  '/logo/client-logo-2.png',
  '/logo/client-logo-3.png',
  '/logo/client-logo-4.png',
  '/logo/client-logo-5.png', // Extended repetition for smoother looping
];

const LogoCarousel = () => {
  return (
    <div className={styles.logoCarouselContainer}>
      <div className={styles.logoCarouselWrapper}>
        {logos.map((logo, index) => (
          <div className={styles.logoItem} key={index}>
            <img src={logo} alt={`logo-${index}`} className={styles.logoImg} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;