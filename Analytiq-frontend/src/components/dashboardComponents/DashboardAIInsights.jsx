import React, { useEffect, useState } from 'react';
import API from '../API.js';
import { THEME_CONFIG } from '../../config.js';
import LoadingSpinner from '../LoadingSpinner.jsx';

export default function DashboardAIInsights({ siteId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        const res = await API.request(`/ai/insights/${siteId}`);
        setInsights(res || []);
      } catch (err) {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    }
    if (siteId) fetchInsights();
  }, [siteId]);

  return (
    <div style={{ border: `1px solid ${THEME_CONFIG.COLORS.borderPrimary}`, borderRadius: THEME_CONFIG.BORDER_RADIUS.medium, padding: 24, background: THEME_CONFIG.COLORS.backgroundSecondary, marginBottom: 24 }}>
      <h4 style={{ marginBottom: 12 }}>Automatic AI Insights</h4>
      {loading ? <LoadingSpinner size={20} /> : (
        insights.length === 0 ? <div>No recent insights.</div> :
        <ul>
          {insights.map((ins, i) => (
            <li key={i} style={{ marginBottom: 12 }}>
              <strong>{ins.summary}</strong><br />
              {ins.root_causes?.length > 0 && <>
                <em>Causes:</em> <ul>{ins.root_causes.map((c, j) => <li key={j}>{c}</li>)}</ul>
              </>}
              {ins.recommendations?.length > 0 && <>
                <em>Recommendations:</em> <ul>{ins.recommendations.map((r, j) => <li key={j}>{r}</li>)}</ul>
              </>}
              {ins.priority && <div><strong>Priority:</strong> {ins.priority}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
