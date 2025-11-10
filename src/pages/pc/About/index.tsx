import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/pc/Header';
import { useTheme } from '../../../hooks/useTheme';
import styles from './styles.module.scss';

// 团队成员数据
const teamMembers = [
  {
    id: 1,
    name: '张三',
    role: '创始人 & CEO',
    avatar: '/vite.svg',
    bio: '全栈开发工程师，10年Web开发经验，热衷于分享技术知识。'
  },
  {
    id: 2,
    name: '李四',
    role: '前端技术主管',
    avatar: '/vite.svg',
    bio: '资深前端工程师，React生态系统专家，关注用户体验和性能优化。'
  },
  {
    id: 3,
    name: '王五',
    role: '后端技术主管',
    avatar: '/vite.svg',
    bio: '系统架构师，精通各种后端技术栈，专注于高可用系统设计。'
  }
];

// 统计数据
const statistics = [
  { label: '文章数量', value: '100+' },
  { label: '技术分类', value: '12' },
  { label: '月访问量', value: '50K+' },
  { label: '社区成员', value: '10K+' }
];

const About: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles['about-container']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
      {/* 顶部导航 */}
      <Header 
        title={t('header.title')}
      />
      
      {/* 主内容区域 */}
      <div className={`${styles['main-content']} `}>
        {/* 页面标题 */}
        <div className={`${styles['page-header']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h1 className={styles['page-title']}>{t('about.title')}</h1>
          <p className={styles['page-description']}>{t('about.description')}</p>
        </div>
        
        {/* 网站介绍 */}
        <div className={`${styles['about-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h2 className={styles['section-title']}>{t('about.aboutUs')}</h2>
          <div className={styles['about-content']}>
            <p className={styles['about-text']}>
              {t('about.introParagraph1')}
            </p>
            <p className={styles['about-text']}>
              {t('about.introParagraph2')}
            </p>
            <p className={styles['about-text']}>
              {t('about.introParagraph3')}
            </p>
          </div>
        </div>
        
        {/* 统计数据 */}
        <div className={`${styles['stats-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <div className={styles['stats-grid']}>
            {statistics.map((stat, index) => (
              <div 
                key={index} 
                className={`${styles['stat-card']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
              >
                <div className={styles['stat-value']}>{stat.value}</div>
                <div className={styles['stat-label']}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 团队介绍 */}
        <div className={`${styles['team-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h2 className={styles['section-title']}>{t('about.ourTeam')}</h2>
          <div className={styles['team-grid']}>
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className={`${styles['team-card']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
              >
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className={styles['member-avatar']}
                />
                <div className={styles['member-info']}>
                  <h3 className={styles['member-name']}>{member.name}</h3>
                  <p className={styles['member-role']}>{member.role}</p>
                  <p className={styles['member-bio']}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 使命与价值观 */}
        <div className={`${styles['values-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h2 className={styles['section-title']}>{t('about.ourValues')}</h2>
          <div className={styles['values-content']}>
            <div className={styles['value-item']}>
              <h3 className={styles['value-title']}>{t('about.valueInnovation')}</h3>
              <p className={styles['value-description']}>{t('about.valueInnovationDesc')}</p>
            </div>
            <div className={styles['value-item']}>
              <h3 className={styles['value-title']}>{t('about.valueKnowledge')}</h3>
              <p className={styles['value-description']}>{t('about.valueKnowledgeDesc')}</p>
            </div>
            <div className={styles['value-item']}>
              <h3 className={styles['value-title']}>{t('about.valueCommunity')}</h3>
              <p className={styles['value-description']}>{t('about.valueCommunityDesc')}</p>
            </div>
          </div>
        </div>
        
        {/* 联系我们 */}
        <div className={`${styles['contact-section']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}>
          <h2 className={styles['section-title']}>{t('about.contactUs')}</h2>
          <div className={styles['contact-content']}>
            <p className={styles['contact-text']}>{t('about.contactDescription')}</p>
            <div className={styles['contact-info']}>
              <div className={styles['contact-item']}>
                <span className={styles['contact-label']}>{t('about.email')}:</span>
                <span className={styles['contact-value']}>contact@example.com</span>
              </div>
              <div className={styles['contact-item']}>
                <span className={styles['contact-label']}>{t('about.github')}:</span>
                <span className={styles['contact-value']}>github.com/example/blog</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
