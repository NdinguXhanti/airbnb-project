// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Support',
      links: [
        'Help Center',
        'Safety information',
        'Cancellation options',
        'Our COVID-19 Response',
        'Supporting people with disabilities',
        'Report a neighborhood concern'
      ]
    },
    {
      title: 'Community',
      links: [
        'Airbnb.org: disaster relief housing',
        'Support Afghan refugees',
        'Combating discrimination',
        'Join the LGBTQ+ community',
        'Guest Referrals',
        'Gift cards'
      ]
    },
    {
      title: 'Hosting',
      links: [
        'Try hosting',
        'AirCover: protection for Hosts',
        'Explore hosting resources',
        'Visit our community forum',
        'How to host responsibly',
        'Host an online experience'
      ]
    },
    {
      title: 'About',
      links: [
        'Newsroom',
        'Learn about new features',
        'Letter from our founders',
        'Careers',
        'Investors',
        'Airbnb Luxe'
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          {footerLinks.map((section, index) => (
            <div key={index} className="footer-section">
              <h4 className="footer-title">{section.title}</h4>
              <ul className="footer-list">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to="#" className="footer-link">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2024 Airbnb Clone. Made for Capstone Project.</p>
            <p>This is a demonstration project for educational purposes.</p>
          </div>
          
          <div className="footer-social">
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
            
            <div className="language-currency">
              <button className="language-btn">
                <FaGlobe /> English (US)
              </button>
              <button className="currency-btn">
                $ USD
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;