import React, { useMemo, memo } from 'react';

const PreviewFrame = memo(({ html, styles }) => {
  const cssVars = useMemo(() => `
    --bg-color: ${styles.bg};
    --text-color: ${styles.text};
    --primary-color: ${styles.primary};
  `, [styles]);

  const srcDoc = useMemo(() => `
    <html>
      <head><style>:root { ${cssVars} } body { background: var(--bg-color); color: var(--text-color); }</style></head>
      <body>${html}</body>
    </html>
  `, [html, cssVars]);

  return <iframe srcDoc={srcDoc} style={{ width: '70%', height: '80vh' }} />;
});

export default PreviewFrame;