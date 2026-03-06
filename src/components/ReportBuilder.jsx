import React, { useState, useCallback, useMemo } from 'react';
import ControlPanel from './ControlPanel';
import PreviewFrame from './PreviewFrame';

const ReportBuilder = () => {
  const [html, setHtml] = useState('');
  const [styles, setStyles] = useState({ bg: '#ffffff', text: '#333333', primary: '#2c3e50' });
  const [aiOriginals, setAiOriginals] = useState({});

  const handleGenerate = useCallback(async (topic) => {
    const res = await fetch('/api/generate-preview', { method: 'POST', body: JSON.stringify({ topic }) });
    const { html, suggestedStyles } = await res.json();
    setHtml(html);
    setStyles(suggestedStyles);
    setAiOriginals(suggestedStyles);
  }, []);

  const updateStyle = useCallback((key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <ControlPanel styles={styles} aiOriginals={aiOriginals} onUpdate={updateStyle} />
      <PreviewFrame html={html} styles={styles} />
    </div>
  );
};
export default ReportBuilder;