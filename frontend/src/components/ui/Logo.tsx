import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="relative w-[35px] h-[35px]">
      <div 
        className="absolute inset-0 rounded-full border-2 border-white"
        style={{
          background: `repeating-linear-gradient(
            135deg,
            transparent,
            transparent 3px,
            rgba(255, 255, 255, 0.2) 3px,
            rgba(255, 255, 255, 0.2) 6px
          )`
        }}
      />
      
      <div 
        className="absolute border-2 border-white rounded-full border-t-0 border-b-0"
        style={{
          width: '45px',
          height: '12px',
          top: '10px',
          left: '-7px'
        }}
      />
    </div>
  );
};

export default Logo;