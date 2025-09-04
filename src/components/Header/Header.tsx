import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { NavItem } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  brandName: string;
  navItems: NavItem[];
  user?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ brandName, navItems, user, onLogout }) => {
  return (
    <header className={styles.header}>
      <Navbar 
        expand="lg" 
        className={styles.navbar}
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="#home" className={styles.brand}>
            {brandName}
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {navItems.map((item, index) => (
                <Nav.Link 
                  key={index} 
                  href={item.href}
                  className={styles.navLink}
                >
                  {item.label}
                </Nav.Link>
              ))}
              {user && onLogout && (
                <Nav.Item className="ms-3">
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={onLogout}
                    className={styles.logoutButton}
                  >
                    Sair
                  </Button>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
