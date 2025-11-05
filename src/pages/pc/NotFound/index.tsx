import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.module.scss';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ lang?: string }>();
  const currentLang = params.lang || 'zh';

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // 如果没有历史记录，返回首页
      navigate(`/${currentLang}`);
    }
  };

  const handleGoHome = () => {
    navigate(`/${currentLang}`);
  };

  return (
    <div className="not-found-wrapper">
      <div id="wrapper">
        <div id="main">
          <div className="inner">
            <div id="columns01" className="container default">
              <div className="wrapper">
                <div className="inner">
                  <div id="image01" className="image">
                    <span className="frame">
                      {/* 复刻PinkPawHost/404ErrorPage的SVG图形 */}
                      <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="#000" strokeWidth="2"/>
                        <line x1="30" y1="30" x2="70" y2="70" stroke="#ff0000" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="70" y1="30" x2="30" y2="70" stroke="#ff0000" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="5,5"/>
                        <text x="50" y="30" fontSize="20" fontWeight="bold" fontFamily="'Space Mono', monospace" textAnchor="middle" fill="#000">404</text>
                      </svg>
                    </span>
                  </div>
                  <h1 id="text03">
                    {currentLang === 'en' ? 'ERROR 404' : 
                     currentLang === 'ja' ? 'エラー 404' : 
                     currentLang === 'ko' ? '오류 404' : '错误 404'}
                  </h1>
                  <h2 id="text06">
                    {currentLang === 'en' ? 'Sorry, the page you requested could not be found. Please make sure you are typing the URL correctly and try again. If you still receive this error, please contact the site administrator.' : 
                     currentLang === 'ja' ? '申し訳ありませんが、お探しのページは見つかりませんでした。URLを正しく入力しているか確認し、もう一度お試しください。' : 
                     currentLang === 'ko' ? '죄송합니다. 요청하신 페이지를 찾을 수 없습니다. URL을 올바르게 입력했는지 확인하고 다시 시도해 주세요.' : 
                     '抱歉，您请求的页面未找到。请确保您输入的URL正确并再次尝试。'}
                  </h2>
                  <ul id="buttons01" className="buttons">
                    <li>
                      <button 
                        onClick={handleGoBack}
                        className="button n01"
                      >
                        {currentLang === 'en' ? 'back to the Website I came from' : 
                         currentLang === 'ja' ? '元のウェブサイトに戻る' : 
                         currentLang === 'ko' ? '원래 웹사이트로 돌아가기' : '返回来源网站'}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={handleGoHome}
                        className="button n02"
                      >
                        {currentLang === 'en' ? 'Go to Homepage' : 
                         currentLang === 'ja' ? 'ホームページに行く' : 
                         currentLang === 'ko' ? '홈페이지로 이동' : '前往首页'}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div id="columns02" className="container default">
              <div className="wrapper">
                <div className="inner">
                  <p id="text05"><em>
                    {currentLang === 'en' ? 'Graphics from SVGRepo.com.' : 
                     currentLang === 'ja' ? 'グラフィックはSVGRepo.comから取得。' : 
                     currentLang === 'ko' ? '그래픽은 SVGRepo.com에서 가져왔습니다.' : '图形来自SVGRepo.com。'}
                  </em></p>
                </div>
              </div>
            </div>
            <p id="text02">
              𝓲 Made with Love by PPH - 
              <a 
                href="https://github.com/PinkPawHost/404ErrorPage" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {currentLang === 'en' ? 'Download this Template here' : 
                 currentLang === 'ja' ? 'このテンプレートをダウンロード' : 
                 currentLang === 'ko' ? '이 템플릿 다운로드' : '在此下载模板'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
