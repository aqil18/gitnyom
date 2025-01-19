import React, { useEffect } from 'react';

const Anatomy: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <iframe 
        src="http://localhost:8080" 
        width="100%" 
        height="100%" 
        title="3D File Tree" 
        style={{ position: 'absolute', top: 0, left: 0, border: 'none' }}
      />
    </div>
  );
};

export default Anatomy;