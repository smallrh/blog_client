import React, { useState } from 'react';

const MobileActivityDesk: React.FC = () => {
  const [language] = useState<string>('en-US');
  
  return (
    <div style={{
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      border: '1px solid blue',
      margin: '10px'
    }}>
      <h1 style={{ fontSize: '24px', color: 'blue' }}>关于我们（移动端）</h1>
      <p style={{ fontSize: '16px', marginTop: '10px' }}>
        这是移动端的关于我们页面。语言设置：{language}
      </p>
    </div>
  );
};

export default MobileActivityDesk;