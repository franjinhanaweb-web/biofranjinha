import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LocationInfo } from '../../types';
import styles from './Location.module.css';

interface LocationProps {
  locationData: LocationInfo;
}

const Location: React.FC<LocationProps> = ({ locationData }) => {
  return (
    <section className={styles.location} id="localizacao">
      <Container>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Localização & Ambiente</h2>
          <p className={styles.sectionSubtitle}>
            Conforto e discrição em um local sofisticado
          </p>
        </div>

        <Row className={styles.locationRow}>
          <Col lg={6} className={styles.locationCol}>
            <div className={styles.locationInfo}>
              <h3 className={styles.locationTitle}>{locationData.area}</h3>
              <p className={styles.locationDescription}>
                {locationData.description}
              </p>
              
              <div className={styles.locationPromise}>
                <h4>Nossa Promessa</h4>
                <p>{locationData.promise}</p>
              </div>
            </div>
          </Col>
          
          <Col lg={6} className={styles.amenitiesCol}>
            <Card className={styles.amenitiesCard}>
              <Card.Body className={styles.amenitiesBody}>
                <h4 className={styles.amenitiesTitle}>Estrutura Completa</h4>
                <div className={styles.amenitiesList}>
                  {locationData.amenities.map((amenity, index) => (
                    <div key={index} className={styles.amenityItem}>
                      <span className={styles.amenityIcon}>✨</span>
                      <span className={styles.amenityText}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className={styles.locationFooter}>
          <div className={styles.locationHighlight}>
            <div className={styles.highlightIcon}>🏠</div>
            <div className={styles.highlightContent}>
              <h4>Flat Discreto</h4>
              <p>Ambiente privado e confortável para sua total tranquilidade</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Location;
