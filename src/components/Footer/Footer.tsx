import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          <Col className={styles.footerContent}>
            <p className={styles.copyright}>
              © {currentYear} Todos os direitos reservados
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
