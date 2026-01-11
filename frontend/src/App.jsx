import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [screen, setScreen] = useState('landing'); 
  const [note, setNote] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Your Official Cloudinary Branding
  const LOGO_URL = "https://res.cloudinary.com/dys8am55x/image/upload/v1768131222/logo_rk0anr.png";
  const LOADER_URL = "https://res.cloudinary.com/dys8am55x/image/upload/v1768131222/loader_riacbw.png";

  const handleExplain = async () => {
    if (!note) return alert("Paste your notes first!");
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/explain/', { note });
      setResult(res.data);
      setScreen('explanation');
    } catch (e) { alert("AI error, try again!"); }
    setLoading(false);
  };

  const fetchHistory = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/saved/');
    setHistory(res.data);
    setScreen('history');
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**')) return <p key={i}><strong>{line.replaceAll('**', '')}</strong></p>;
      if (line.startsWith('*')) return <li key={i}>{line.replace('*', '')}</li>;
      return <p key={i}>{line}</p>;
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
        {/* Your Brain Icon Loader with a spinning animation */}
        <img 
          src={LOADER_URL} 
          style={{ width: '80px', marginBottom: '20px', animation: 'spin 2s linear infinite' }} 
          alt="Thinking..." 
        />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <p style={{ color: '#27ae60', fontWeight: 'bold' }}>Thinkora is thinking...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif', color: '#2c3e50' }}>
      
      {screen === 'landing' && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <img src={LOGO_URL} style={{ width: '220px', marginBottom: '30px' }} alt="Thinkora Logo" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Study smarter for your courses</h2>
          <p style={{ color: '#7f8c8d' }}>Instant clarity for Nigerian university students.</p>
          <button onClick={() => setScreen('input')} style={btnStyle}>Start Studying</button>
          <button onClick={fetchHistory} style={{...btnStyle, background: '#95a5a6', marginTop: '10px'}}>View Library</button>
        </div>
      )}

      {screen === 'input' && (
        <div>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '120px', marginBottom: '10px' }} alt="Thinkora" /></div>
          <h3>Paste your note or topic</h3>
          <textarea 
            style={textareaStyle}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g. Nigerian Legal System..."
          />
          <button onClick={handleExplain} style={btnStyle}>Explain This</button>
          <button onClick={() => setScreen('landing')} style={backBtn}>Back</button>
        </div>
      )}

      {screen === 'explanation' && result && (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '100px', marginBottom: '10px' }} alt="Thinkora" /></div>
          <h3>Simplified Explanation</h3>
          {formatText(result.explanation)}
          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <button onClick={() => setScreen('questions')} style={btnStyle}>Generate Questions</button>
            <button onClick={() => setScreen('landing')} style={{...btnStyle, background: '#34495e'}}>Save & Close</button>
          </div>
        </div>
      )}

      {screen === 'questions' && result && (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '100px', marginBottom: '10px' }} alt="Thinkora" /></div>
          <h3>Practice Exam Questions</h3>
          {result.questions.map((q, i) => (
            <div key={i} style={{marginBottom: '15px'}}>
              <strong>Q{i+1}:</strong> {q}
            </div>
          ))}
          <button onClick={() => setScreen('explanation')} style={btnStyle}>Back to Explanation</button>
        </div>
      )}

      {screen === 'history' && (
        <div>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '120px', marginBottom: '10px' }} alt="Thinkora" /></div>
          <h3>Personal Study Library</h3>
          {history.length === 0 ? <p>Your library is empty.</p> : history.map(s => (
            <div key={s.id} style={historyItemStyle}>
              <p><strong>{s.note.substring(0, 40)}...</strong></p>
              <button onClick={() => { setResult(s); setScreen('explanation'); }} style={smallBtn}>Open</button>
            </div>
          ))}
          <button onClick={() => setScreen('landing')} style={backBtn}>Back home</button>
        </div>
      )}
    </div>
  );
}

const btnStyle = { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const textareaStyle = { width: '100%', height: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px', fontSize: '1rem' };
const cardStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' };
const backBtn = { background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginTop: '20px', display: 'block', width: '100%' };
const historyItemStyle = { borderBottom: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const smallBtn = { padding: '5px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '3px' };

export default App;
