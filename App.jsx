import React, { useState, useEffect } from 'react';

export default function App() {
  const [metrics, setMetrics] = useState([]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/analytics/dashboard');
      const data = await res.json();
      setMetrics(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMetrics(); }, []);

  const simulateUserAction = async (pageName) => {
    try {
      await fetch('http://localhost:5002/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pageName })
      });
      fetchMetrics(); // Real-time update on dashboard
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto' }}>
      <h2>📈 Full-Stack Realtime Analytics Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#fafafa', padding: '15px', border: '1px solid #ddd' }}>
        <h4>Simulate Live Website Traffic:</h4>
        <button onClick={() => simulateUserAction('Home Page')} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px' }}>Visit Home Page</button>
        <button onClick={() => simulateUserAction('Pricing Page')} style={{ background: '#008CBA', color: 'white', border: 'none', padding: '10px' }}>Visit Pricing Page</button>
      </div>

      <h3>Live Metrics Table</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
        {metrics.map(m => (
          <div key={m._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#fff' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{m.page}</h4>
            <p style={{ margin: '5px 0' }}>👥 Visitors: <strong>{m.visitors}</strong></p>
            <p style={{ margin: '5px 0' }}>🖱️ Clicks: <strong>{m.clicks}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
