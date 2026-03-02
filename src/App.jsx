import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// This dynamically finds your Server on Port 3000
const api = axios.create({
  baseURL: `http://desktop-ncuornl.tail879b8e.ts.net:3000`, 
  withCredentials: true,
});

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function App() {
  const [user, setUser] = useState({ use: '', pas: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(25); 
  const [hours, setHours] = useState({
    Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
  });
  const [totalPay, setTotalPay] = useState(0);
  const [status, setStatus] = useState('');

  // Calculate pay automatically
  useEffect(() => {
    const totalHours = Object.values(hours).reduce((sum, h) => sum + Number(h), 0);
    setTotalPay(totalHours * hourlyRate);
  }, [hours, hourlyRate]);

  const handleHourChange = (day, value) => {
    setHours(prev => ({ ...prev, [day]: value }));
  };

  const saveWeeklySheet = async () => {
    try {
      setStatus("Saving...");
      await api.post('/api/data', {
        weekData: hours,
        rate: hourlyRate,
        totalPay: totalPay.toFixed(2),
        timestamp: new Date().toISOString()
      });
      setStatus("Week updated and saved to server!");
    } catch (err) {
      setStatus("Error saving data. Check if server is running.");
    }
  };

  const deleteSheet = async () => {
    const fileName = prompt("Enter filename to delete (Caution: MUST DOCUMENT DELETION):");
    if (!fileName) return;

    try {
      await api.delete('/api/data', { data: { fileName } });
      setStatus("File successfully deleted.");
    } catch (err) {
      setStatus("Delete failed. File might not exist.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <h2>Employee Timesheet Login</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <input type="text" placeholder="Username" onChange={e => setUser({...user, use: e.target.value})} />
          <input type="password" placeholder="Password" onChange={e => setUser({...user, pas: e.target.value})} />
          <button onClick={async () => {
            try { 
              await api.post('/login', user); 
              setIsLoggedIn(true); 
              setStatus("Welcome!");
            } catch { setStatus("Invalid Credentials"); }
          }}>Login</button>
        </div>
        <p>{status}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
      <h1>Weekly Hours</h1>
      
      {DAYS.map(day => (
        <div key={day} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>{day}</label>
          <input 
            type="number" 
            value={hours[day]} 
            onChange={(e) => handleHourChange(day, e.target.value)} 
            style={{ width: '80px', padding: '5px' }}
          />
        </div>
      ))}

      <div style={{ marginTop: '20px', background: '#eef2f3', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ margin: 0 }}>Total Pay: ${totalPay.toFixed(2)}</h3>
        <small>Current Rate: ${hourlyRate}/hr</small>
      </div>

      <button onClick={saveWeeklySheet} style={{ marginTop: '20px', padding: '12px', width: '100%', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Submit & Update Week
      </button>

      {/* --- THE BIG WARNING --- */}
      <div style={{ 
        marginTop: '50px', 
        border: '4px solid #ff0000', 
        padding: '20px', 
        backgroundColor: '#fff1f1',
        borderRadius: '10px'
      }}>
        <h2 style={{ color: '#d00', marginTop: 0 }}>🛑 STOP / WARNING 🛑</h2>
        <p style={{ fontWeight: 'bold' }}>TEXT ME BEFORE DELETING ANY POSTS!</p>
        <p style={{ fontSize: '0.9rem' }}>All deletions must be manually documented. Do not delete unless instructed.</p>
        <button onClick={deleteSheet} style={{ backgroundColor: '#d00', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
          Authorized Delete
        </button>
      </div>

      <p style={{ marginTop: '20px', color: '#666' }}><strong>Status:</strong> {status}</p>
    </div>
  );
}

export default App;




///dont forget to install pm2 globalley via npm -g