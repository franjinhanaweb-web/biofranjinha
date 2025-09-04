import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BadgeTag from '../BadgeTag/BadgeTag';
import styles from './AuthHero.module.css';

interface AuthHeroProps {
  title: string;
  subtitle: string;
  accentWord: string;
  tagText: string;
  imageSrc: string;
  imageAlt: string;
  onLogin: () => void;
  onRegister: () => void;
}

const AuthHero: React.FC<AuthHeroProps> = ({
  title,
  subtitle,
  accentWord,
  tagText,
  imageSrc,
  imageAlt,
  onLogin,
  onRegister
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
                <div className={styles.authButtons}>
                  <button 
                    className={styles.loginButton}
                    onClick={onLogin}
                  >
                    <span className={styles.buttonText}>Fazer Login</span>
                    <span className={styles.buttonIcon}>→</span>
                  </button>
                  
                  <button 
                    className={styles.registerButton}
                    onClick={onRegister}
                  >
                    <span className={styles.buttonText}>Criar Conta</span>
                    <span className={styles.buttonIcon}>+</span>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className={styles.divider}></div>
    </section>
  );
};

export default AuthHero;
