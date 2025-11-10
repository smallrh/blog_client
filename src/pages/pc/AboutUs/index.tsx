import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import styles from './styles.module.scss';

const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  useTheme();
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('about.title')}</h1>
      <p className={styles.description}>
        {t('about.description')}
      </p>
      <div className={styles.developing}>
        {t('about.developing')}
      </div>
    </div>
  );
};

export default AboutUs;