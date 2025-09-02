import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PreferencesLimits } from '../../types';
import styles from './Preferences.module.css';

interface PreferencesProps {
  preferencesData: PreferencesLimits;
}

const Preferences: React.FC<PreferencesProps> = ({ preferencesData }) => {
  return (
    <section className={styles.preferences} id="preferencias">
      <Container>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Preferências & Limites</h2>
          <p className={styles.sectionSubtitle}>
            Transparência e clareza para uma experiência perfeita
          </p>
        </div>

        <Row className={styles.preferencesRow}>
          <Col lg={6} className={styles.offersCol}>
            <Card className={styles.offersCard}>
              <Card.Body className={styles.offersBody}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>💝</div>
                  <h3 className={styles.cardTitle}>O que ofereço</h3>
                </div>
                
                <div className={styles.offersList}>
                  {preferencesData.offers.map((offer, index) => (
                    <div key={index} className={styles.offerItem}>
                      <span className={styles.offerIcon}>✓</span>
                      <span className={styles.offerText}>{offer}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6} className={styles.limitsCol}>
            <Card className={styles.limitsCard}>
              <Card.Body className={styles.limitsBody}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>🚫</div>
                  <h3 className={styles.cardTitle}>Limites</h3>
                </div>
                
                <div className={styles.limitsList}>
                  {preferencesData.limits.map((limit, index) => (
                    <div key={index} className={styles.limitItem}>
                      <span className={styles.limitIcon}>✗</span>
                      <span className={styles.limitText}>{limit}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className={styles.preferencesFooter}>
          <div className={styles.preferencesMessage}>
            <h4>Respeito Mútuo</h4>
            <p>
              Acredito que a comunicação clara e o respeito aos limites são essenciais 
              para uma experiência agradável e segura para ambos.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Preferences;
