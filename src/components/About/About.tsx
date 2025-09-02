import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AboutSection } from '../../types';
import styles from './About.module.css';

interface AboutProps {
  aboutData: AboutSection;
}

const About: React.FC<AboutProps> = ({ aboutData }) => {
  return (
    <section className={styles.about} id="sobre">
      <Container>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{aboutData.title}</h2>
          <p className={styles.sectionSubtitle}>
            Conheça um pouco mais sobre minha forma de trabalho
          </p>
        </div>

        <Row className={styles.qualitiesRow}>
          {aboutData.qualities.map((quality, index) => (
            <Col key={index} lg={4} md={6} className={styles.qualityCol}>
              <Card className={styles.qualityCard}>
                <Card.Body className={styles.qualityBody}>
                  <div className={styles.qualityIcon}>
                    <span className={styles.iconText}>{quality.icon}</span>
                  </div>
                  
                  <h3 className={styles.qualityTitle}>{quality.title}</h3>
                  
                  <p className={styles.qualityDescription}>
                    {quality.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className={styles.aboutFooter}>
          <div className={styles.aboutMessage}>
            <p>
              Sou uma companhia carinhosa e atenciosa, que valoriza o conforto e 
              bem-estar de cada cliente. Cada encontro é único e especial, 
              criado com cuidado e respeito mútuo.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
