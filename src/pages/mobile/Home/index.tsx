import React, { useState } from 'react';

const Home: React.FC = () => {
  const [language] = useState<string>('en');
  
  return (
    <div style={{
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      border: '1px solid red',
      margin: '10px'
    }}>
      <h1 style={{ fontSize: '24px', color: 'red' }}>首页（移动端）</h1>
      <p style={{ fontSize: '16px', marginTop: '10px' }}>
        这是移动端的首页内容。语言设置：{language}
      </p>
    </div>
  );
};

export default Home;