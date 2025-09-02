import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavItem } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  brandName: string;
  navItems: NavItem[];
}

const Header: React.FC<HeaderProps> = ({ brandName, navItems }) => {
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
