import React, { useState } from 'react';
import { Download, Wand2, Settings2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportBuilder = () => {
  const [topic, setTopic] = useState('');
  const [prompt, setPrompt] = useState('Write a professional report on this topic.'); // New: AI Prompt Input
  const [html, setHtml] = useState('');
  const [manifesto, setManifesto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontColor, setFontColor] = useState('#333333');

  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a topic");
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userPrompt: prompt }) // Send prompt to backend
      });
      const data = await res.json();
      setHtml(data.html);
      setManifesto(data.styleManifesto);
      setBgColor(data.styleManifesto.colors.bg);
      setFontColor(data.styleManifesto.colors.text);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const res = await fetch('http://localhost:3000/api/render-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, styleManifesto: manifesto })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "report.pdf";
    a.click();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>AI Report Generator</h1>
        <Link to="/matrix" style={{ color: '#3498db' }}>View Design Matrix</Link>
      </div>

      {/* Input Section */}
      <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input style={{ padding: '12px' }} placeholder="Report Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <textarea 
          style={{ padding: '12px', minHeight: '80px' }} 
          placeholder="Architect your report: e.g., 'Use two columns, striped tables, and a blue header...'" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
        />
        <button onClick={handleGenerate} disabled={loading} style={{ padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none' }}>
          {loading ? 'Generating...' : <><Sparkles size={16}/> Generate Report</>}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', height: '60vh' }}>
        {/* Sidebar Controls */}
        <div style={{ width: '30%', padding: '20px', border: '1px solid #eee' }}>
          <h3><Settings2 size={18}/> Manual Overrides</h3>
          <label>Background: </label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          <label>Text: </label><input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
          
          {manifesto && (
            <div style={{ marginTop: '20px', fontSize: '0.85rem' }}>
              <strong>Applied Design:</strong>
              <ul>{manifesto.featuresUsed.map(f => <li key={f}>{f}</li>)}</ul>
            </div>
          )}
          <button onClick={handleDownloadPdf} style={{ width: '100%', marginTop: '20px' }}><Download size={16}/> Download PDF</button>
        </div>
        
        {/* Preview */}
        <div style={{ width: '70%', border: '1px solid #ccc' }}>
          <iframe 
            srcDoc={`<style>body { background-color: ${bgColor}; color: ${fontColor}; padding: 40px; font-family: sans-serif; }</style>${html}`} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;