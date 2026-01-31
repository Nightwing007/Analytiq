import React from 'react';
// For demo: Use recharts' ComposedChart for a bar-like map, but in real use, a map library (e.g., react-simple-maps, leaflet, or deck.gl) is best.
// Here, we use a horizontal bar chart as a placeholder for a choropleth map, with country names and percent.
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const COLORS = [
  '#00F0FF', '#FF00E0', '#FFD600', '#00FF85', '#7C3AED', '#FF4B2B', '#1DE9B6', '#FF61A6', '#FFB300', '#00B8D9'
];

/**
 * GeoDistributionBarChart (Map Placeholder)
 * @param {Array} data - geo_distribution array: [{ country: 'India', percent: 42.5 }, ...]
 */
const GeoDistributionBarChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No geographic data available.
      </div>
    );
  }

  return (
    <div className="bg-[#10172A] rounded-lg p-6 border-2 border-[#00F0FF] shadow-neon">
      <h3 className="text-white font-orbitron font-semibold mb-4 flex items-center gap-2">
        <span role="img" aria-label="map">🗺️</span> Geographic Distribution
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#00F0FF', fontFamily: 'Rajdhani' }} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="country" tick={{ fill: '#fff', fontFamily: 'Rajdhani' }} width={120} />
          <Tooltip contentStyle={{ background: '#181F3A', border: '1px solid #00F0FF', color: '#fff', fontFamily: 'Rajdhani' }} formatter={(v) => `${v}%`} />
          <Legend iconType="circle" wrapperStyle={{ color: '#fff', fontFamily: 'Rajdhani', fontSize: 14 }} />
          <Bar dataKey="percent" radius={[8, 8, 8, 8]}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-green-400 text-xs mt-4 text-center font-rajdhani">geo_distribution (map placeholder)</p>
    </div>
  );
};

export default GeoDistributionBarChart;
