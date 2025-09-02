import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { HeroProps } from '../../types';
import BadgeTag from '../BadgeTag/BadgeTag';
import styles from './Hero.module.css';

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  accentWord,
  ctaText,
  tagText,
  imageSrc,
  imageAlt
}) => {
  const renderTitle = () => {
    const words = title.split(' ');
    return words.map((word, index) => {
      if (word.toLowerCase() === accentWord.toLowerCase()) {
        return (
          <span key={index} className={styles.accentWord}>
            {word}
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

  return (
    <section className={styles.hero} id="home">
      <Container fluid>
        <Row className={styles.heroRow}>
          <Col lg={6} className={styles.imageCol}>
            <div className={styles.imageContainer}>
              <img 
                src={imageSrc} 
                alt={imageAlt}
                className={styles.heroImage}
                loading="lazy"
              />
              <div className={styles.imageFadeOut}></div>
            </div>
          </Col>
          
          <Col lg={6} className={styles.contentCol}>
            <div className={styles.content}>
              {tagText && (
                <div className={styles.tagContainer}>
                  <BadgeTag text={tagText} variant="primary" />
                </div>
              )}
              
              <h1 className={styles.title}>
                {renderTitle()}
              </h1>
              
              <p className={styles.subtitle}>
                {subtitle}
              </p>
              
              <div className={styles.ctaContainer}>
                <Button 
                  className={styles.ctaButton}
                  size="lg"
                  href="#contact"
                >
                  {ctaText}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className={styles.divider}></div>
    </section>
  );
};

export default Hero;
