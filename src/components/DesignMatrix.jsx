import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DesignMatrix = () => {
  const [viewMode, setViewMode] = useState('user');

  const matrixData = [
    { goal: "Page-Specific BG", user: "Assign a unique image/color to any individual page by ID.", dev: "#page-1 { background-image: url('...'); background-position: center; }" },
    { goal: "Bg Attachment", user: "Locks background in place so it doesn't move with content.", dev: "background-attachment: fixed;" },
    { goal: "Section Styling", user: "Apply custom styles (shadows, borders) to specific section IDs.", dev: "#section-1 { box-shadow: 0 4px 10px rgba(0,0,0,0.2); }" },
    { goal: "Professional Layout", user: "Splits text into two columns.", dev: "column-count: 2;" },
    { goal: "Highlighted Boxes", user: "Colored callout box for key insights.", dev: ".callout { background: #f0f4f8; border-left: 4px solid #3498db; }" },
    { goal: "Table Striping", user: "Alternates row colors in tables.", dev: "tr:nth-child(even) { background: #f8f9fa; }" },
    { goal: "Visual Hierarchy", user: "Scales headings for emphasis.", dev: "h1 { font-size: 2.5rem; }" },
    { goal: "White Space", user: "Adds breathing room around edges.", dev: "padding: 20mm;" },
    { goal: "Watermarks", user: "Places faint branding in background.", dev: "position: absolute; opacity: 0.1;" }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', background: '#fff' }}>
      <Link to="/" style={{ color: '#3498db', fontWeight: 'bold' }}>← Back to Generator</Link>
      
      <h2 style={{ marginTop: '20px' }}>PDF Style Documentation</h2>
      
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.95rem' }}>
        <strong>How to prompt the AI:</strong> To architect your PDF, be explicit about IDs and page structures. 
        <em> Example: "Generate a 3-page report. Use ID 'page-1' for the cover with a background image centered using 'background-position: center'. Wrap the summary in a div with ID 'section-1' and apply a 'box-shadow' for depth."</em>
        Referencing these IDs allows you to style every page and section uniquely.
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setViewMode('user')} style={{ marginRight: '10px' }}>User Friendly</button>
        <button onClick={() => setViewMode('dev')}>HTML & CSS Manual</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>Design Goal</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>{viewMode === 'user' ? 'How it works' : 'Implementation'}</th>
          </tr>
        </thead>
        <tbody>
          {matrixData.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{item.goal}</td>
              <td style={{ padding: '10px', fontFamily: viewMode === 'dev' ? 'monospace' : 'inherit' }}>
                {viewMode === 'user' ? item.user : item.dev}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignMatrix;