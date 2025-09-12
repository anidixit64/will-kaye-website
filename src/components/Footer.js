import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const FooterContainer = styled.footer`
  background: #322214 !important;
  color: #F5F3F0 !important;
  padding: ${theme.spacing['3xl']} 0 ${theme.spacing.xl};
  margin-top: auto;
  border-top: 2px solid #93A3B1;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  text-align: center;
`;

const FooterText = styled.p`
  color: #4C443C !important;
  font-size: ${theme.fontSizes.sm};
  margin-bottom: ${theme.spacing.md};
  font-family: ${theme.fonts.primary};
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const SocialLink = styled.a`
  color: #4C443C !important;
  font-size: ${theme.fontSizes.lg};
  transition: color ${theme.transitions.normal};
  
  &:hover {
    color: #7C898B !important;
  }
`;

const Copyright = styled.p`
  color: #4C443C !important;
  font-size: ${theme.fontSizes.xs};
  border-top: 1px solid #93A3B1;
  padding-top: ${theme.spacing.lg};
  font-family: ${theme.fonts.primary};
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          Will Kaye - Musician & Artist
        </FooterText>
        
        <SocialLinks>
          <SocialLink href="#" aria-label="Instagram">
            📷
          </SocialLink>
          <SocialLink href="#" aria-label="Spotify">
            🎵
          </SocialLink>
          <SocialLink href="#" aria-label="YouTube">
            📺
          </SocialLink>
          <SocialLink href="#" aria-label="Twitter">
            🐦
          </SocialLink>
        </SocialLinks>
        
        <Copyright>
          © {new Date().getFullYear()} Will Kaye. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
