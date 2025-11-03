import React from 'react';

interface HeroProps {
  image: string;
  cta: string;
}

const Hero: React.FC<HeroProps> = ({ image, cta }) => (
  <div className="pc-hero">
    <img src={image} alt="" />
    <button>{cta}</button>
  </div>
);

export default Hero;