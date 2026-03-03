// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// // This dynamically finds your Server on Port 3000
// const api = axios.create({
//   baseURL: `http://desktop-ncuornl.tail879b8e.ts.net:3000`, 
//   withCredentials: true,
// });

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// function App() {
//   const [user, setUser] = useState({ use: '', pas: '' });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [hourlyRate, setHourlyRate] = useState(25); 
//   const [hours, setHours] = useState({
//     Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
//   });
//   const [totalPay, setTotalPay] = useState(0);
//   const [status, setStatus] = useState('');

//   // Calculate pay automatically
//   useEffect(() => {
//     const totalHours = Object.values(hours).reduce((sum, h) => sum + Number(h), 0);
//     setTotalPay(totalHours * hourlyRate);
//   }, [hours, hourlyRate]);

//   const handleHourChange = (day, value) => {
//     setHours(prev => ({ ...prev, [day]: value }));
//   };

//   const saveWeeklySheet = async () => {
//     try {
//       setStatus("Saving...");
//       await api.post('/api/data', {
//         weekData: hours,
//         rate: hourlyRate,
//         totalPay: totalPay.toFixed(2),
//         timestamp: new Date().toISOString()
//       });
//       setStatus("Week updated and saved to server!");
//     } catch (err) {
//       setStatus("Error saving data. Check if server is running.");
//     }
//   };

//   const deleteSheet = async () => {
//     const fileName = prompt("Enter filename to delete (Caution: MUST DOCUMENT DELETION):");
//     if (!fileName) return;

//     try {
//       await api.delete('/api/data', { data: { fileName } });
//       setStatus("File successfully deleted.");
//     } catch (err) {
//       setStatus("Delete failed. File might not exist.");
//     }
//   };

//   if (!isLoggedIn) {
//     return (
//       <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
//         <h2>Employee Timesheet Login</h2>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
//           <input type="text" placeholder="Username" onChange={e => setUser({...user, use: e.target.value})} />
//           <input type="password" placeholder="Password" onChange={e => setUser({...user, pas: e.target.value})} />
//           <button onClick={async () => {
//             try { 
//               await api.post('/login', user); 
//               setIsLoggedIn(true); 
//               setStatus("Welcome!");
//             } catch { setStatus("Invalid Credentials"); }
//           }}>Login</button>
//         </div>
//         <p>{status}</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '20px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
//       <h1>Weekly Hours</h1>
      
//       {DAYS.map(day => (
//         <div key={day} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <label>{day}</label>
//           <input 
//             type="number" 
//             value={hours[day]} 
//             onChange={(e) => handleHourChange(day, e.target.value)} 
//             style={{ width: '80px', padding: '5px' }}
//           />
//         </div>
//       ))}

//       <div style={{ marginTop: '20px', background: '#eef2f3', padding: '15px', borderRadius: '8px' }}>
//         <h3 style={{ margin: 0 }}>Total Pay: ${totalPay.toFixed(2)}</h3>
//         <small>Current Rate: ${hourlyRate}/hr</small>
//       </div>

//       <button onClick={saveWeeklySheet} style={{ marginTop: '20px', padding: '12px', width: '100%', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
//         Submit & Update Week
//       </button>

//       {/* --- THE BIG WARNING --- */}
//       <div style={{ 
//         marginTop: '50px', 
//         border: '4px solid #ff0000', 
//         padding: '20px', 
//         backgroundColor: '#fff1f1',
//         borderRadius: '10px'
//       }}>
//         <h2 style={{ color: '#d00', marginTop: 0 }}>🛑 STOP / WARNING 🛑</h2>
//         <p style={{ fontWeight: 'bold' }}>TEXT ME BEFORE DELETING ANY POSTS!</p>
//         <p style={{ fontSize: '0.9rem' }}>All deletions must be manually documented. Do not delete unless instructed.</p>
//         <button onClick={deleteSheet} style={{ backgroundColor: '#d00', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
//           Authorized Delete
//         </button>
//       </div>

//       <p style={{ marginTop: '20px', color: '#666' }}><strong>Status:</strong> {status}</p>
//     </div>
//   );
// }

// export default App;




// ///dont forget to install pm2 globalley via npm -g




// import { useState } from 'react';

// function App() {
//   const [prompt, setPrompt] = useState('');
//   const [style, setStyle] = useState('professional');
//   const [bgImage, setBgImage] = useState(null);
//   const [htmlContent, setHtmlContent] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Convert uploaded image to Base64 for the backend
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setBgImage(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handlePreview = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:3000/api/preview-report', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt, bgImage, style }),
//       });
//       const data = await res.json();
//       setHtmlContent(data.html);
//     } catch (err) {
//       alert("Failed to fetch preview.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:3000/api/download-report', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt, bgImage, style }),
//       });

//       if (!response.ok) throw new Error('PDF Generation failed');

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'report.pdf';
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (error) {
//       alert('Error downloading PDF');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto' }}>
//       <h1>AI Report Generator</h1>
      
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//         <textarea 
//           placeholder="Describe your report..."
//           value={prompt} 
//           onChange={(e) => setPrompt(e.target.value)} 
//           style={{ height: '80px' }}
//         />
        
//         <input 
//           type="text" 
//           placeholder="Style (e.g., minimalist, corporate, bold)"
//           value={style} 
//           onChange={(e) => setStyle(e.target.value)} 
//         />
        
//         <label>Background Image:</label>
//         <input type="file" onChange={handleImageUpload} accept="image/*" />
//       </div>
      
//       <button onClick={handlePreview} disabled={loading} style={{ marginTop: '20px' }}>
//         {loading ? 'Processing...' : 'Generate Preview'}
//       </button>

//       {htmlContent && (
//         <div style={{ marginTop: '30px' }}>
//           <h3>Live Preview</h3>
//           <iframe 
//             srcDoc={htmlContent} 
//             title="Preview" 
//             style={{ width: '100%', height: '500px', border: '1px solid #ddd' }} 
//           />
//           <button 
//             onClick={handleDownload} 
//             disabled={loading} 
//             style={{ marginTop: '10px', background: 'green', color: 'white', padding: '10px' }}
//           >
//             Download Final PDF
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;




import { useState, useEffect } from 'react';

const App = () => {
    const pass = "password";
    const [display, setDisplay] = useState(Array(pass.length).fill(""));

    useEffect(() => {
        // 1. Define the function outside so add/remove use the same reference
        const handleKeyDown = (e) => {
            const index = e.target.id;
            // Ensure index is valid and within range
            if (index !== "" && pass[index] && e.key === pass.charAt(index)) {
                setDisplay((prev) => {
                    const newDisplay = [...prev];
                    newDisplay[index] = e.key;
                    return newDisplay;
                });
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        // 2. Clean up using the SAME function reference
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []); // Empty dependency array is fine now because we use functional updates

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}>
            {display.map((_, i) => (
                <div 
                    key={i} 
                    id={i} 
                    // 3. tabIndex="0" makes the div focusable so it can be the event target
                    tabIndex="0" 
                    style={{ 
                        width: '100px', 
                        height: '100px', 
                        border: '5px solid black',
                        cursor: 'pointer'
                    }}
                >
                    {display[i]}
                </div>
            ))}
        </div>
    );
};

export default App;