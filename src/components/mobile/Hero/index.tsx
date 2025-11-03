import React from 'react';

interface HeroProps {
  image: string;
  cta: string;
}

const Hero: React.FC<HeroProps> = ({ image, cta }) => (
  <div className="mobile-hero">
    <img src={image} alt="" style={{ width: '100%' }} />
    <button style={{ padding: 8 }}>{cta}</button>
  </div>
);

export default Hero;