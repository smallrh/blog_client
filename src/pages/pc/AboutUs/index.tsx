import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="about-us-container" style={{
      backgroundColor: 'white',
      color: 'black',
      padding: '40px',
      border: '2px solid blue',
      margin: '20px'
    }}>
      <h1 style={{ fontSize: '36px', color: 'blue' }}>{t('about.title')}</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        {t('about.description')}
      </p>
      <div style={{
        backgroundColor: 'lightblue',
        padding: '20px',
        marginTop: '20px'
      }}>
        {t('about.developing')}
      </div>
    </div>
  );
};

export default AboutUs;