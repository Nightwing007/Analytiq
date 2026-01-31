import React, { useState } from 'react';
import { THEME_CONFIG } from '../../config.js';
import API from '../API.js';
import LoadingSpinner from '../LoadingSpinner.jsx';

const metricsList = [
  { key: 'page_views', label: 'Page Views' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'scroll_depth', label: 'Scroll Depth' },
  { key: 'bounce_rate', label: 'Bounce Rate' },
  // Add more as needed
];

export default function DashboardMetricDeepDive({ siteId, page }) {
  const [selectedMetric, setSelectedMetric] = useState(metricsList[0].key);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await API.chatMetric(siteId, selectedMetric, input, page);
      setResponse(res);
    } catch (err) {
      setResponse({ summary: 'Error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`, borderRadius: THEME_CONFIG.BORDER_RADIUS.medium, padding: 24, background: THEME_CONFIG.COLORS.backgroundSecondary, marginBottom: 24 }}>
      <h4 style={{ marginBottom: 12 }}>Metric Deep Dive</h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select value={selectedMetric} onChange={e => setSelectedMetric(e.target.value)}>
          {metricsList.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
        <input
          type="text"
          placeholder="Ask a question about this metric..."
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading || !input.trim()}>Ask</button>
      </form>
      {loading && <LoadingSpinner size={20} />}
      {response && (
        <div style={{ marginTop: 16 }}>
          <strong>Summary:</strong> {response.summary}<br />
          {response.root_causes?.length > 0 && <>
            <strong>Root Causes:</strong>
            <ul>{response.root_causes.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </>}
          {response.recommendations?.length > 0 && <>
            <strong>Recommendations:</strong>
            <ul>{response.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </>}
          {response.priority && <div><strong>Priority:</strong> {response.priority}</div>}
        </div>
      )}
    </div>
  );
}
