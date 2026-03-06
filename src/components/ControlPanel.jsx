import React, { memo } from 'react';

const ControlPanel = memo(({ styles, aiOriginals, onUpdate }) => {
  return (
    <div className="sidebar">
      <h3>Style Manager</h3>
      {Object.entries(styles).map(([key, value]) => (
        <div key={key}>
          <label>{key}</label>
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onUpdate(key, e.target.value)} 
          />
          {value !== aiOriginals[key] && <span> (Custom)</span>}
        </div>
      ))}
    </div>
  );
});

export default ControlPanel;