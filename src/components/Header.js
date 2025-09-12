import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const HeaderContainer = styled.header`
  background: ${theme.colors.background};
  border-bottom: 2px solid ${theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(245, 243, 240, 0.95);
  box-shadow: 0 2px 8px rgba(50, 34, 20, 0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${theme.colors.primary};
  text-decoration: none;
  font-family: ${theme.fonts.primary};
  letter-spacing: -0.02em;
  
  &:hover {
    color: ${theme.colors.accent};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${theme.colors.background};
    border-bottom: 1px solid ${theme.colors.border};
    flex-direction: column;
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.lg};
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.isActive ? theme.colors.accent : theme.colors.text};
  font-weight: 500;
  text-decoration: none;
  transition: color ${theme.transitions.normal};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.lg};
  
  &:hover {
    color: ${theme.colors.accent};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/releases', label: 'Music' },
    { path: '/shows', label: 'Shows' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Will Kaye</Logo>
        
        <NavLinks isOpen={isMenuOpen}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              isActive={location.pathname === item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
