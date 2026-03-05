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




// import { useState, useEffect } from 'react';

// const App = () => {
//     const pass = "password";
//     const [display, setDisplay] = useState(Array(pass.length).fill(""));

//     useEffect(() => {
//         // 1. Define the function outside so add/remove use the same reference
//         const handleKeyDown = (e) => {
//             const index = e.target.id;
//             // Ensure index is valid and within range
//             if (index !== "" && pass[index] && e.key === pass.charAt(index)) {
//                 setDisplay((prev) => {
//                     const newDisplay = [...prev];
//                     newDisplay[index] = e.key;
//                     return newDisplay;
//                 });
//             }
//         };

//         document.addEventListener("keydown", handleKeyDown);
//         // 2. Clean up using the SAME function reference
//         return () => document.removeEventListener("keydown", handleKeyDown);
//     }, []); // Empty dependency array is fine now because we use functional updates

//     return (
//         <div style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}>
//             {display.map((_, i) => (
//                 <div 
//                     key={i} 
//                     id={i} 
//                     // 3. tabIndex="0" makes the div focusable so it can be the event target
//                     tabIndex="0" 
//                     style={{ 
//                         width: '100px', 
//                         height: '100px', 
//                         border: '5px solid black',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     {display[i]}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default App;


// import {useState, useEffect, useRef} from 'react'




// const App = () => { 
//     const ref = useRef(null)
//     const [index, setI] = useState(0)
//     var words = ["can", "fart", "man", "fan", "luke", "skywalker"]
//     var word = words.at(index)
//     const [d, setD] = useState(Array(word.length).fill(null))
//     const [i, setIi] = useState(0)



//     useEffect(() => {
//         setD(Array(words.at(index).length).fill(null))
//     }, [index])


//     const ONKEYDOWN = (e) => {

//         const newd = [...d]

//         if(e.key.length === 1 && word.charAt((i)) === e.key){

//                 newd[i] = e.key
//                 var nexti = i + 1

//                 if(word.length === nexti){
//                     setIi(0)
//                     setI(Math.floor(Math.random() * words.length))
//                 }
//                 else{
//                     setIi(nexti)
//                     setD(newd) 
//                 }
//             }

//         //     if(ref.current){
//         //         ref.current.value = ""
//         //     }
//         }
    

       
         


//     return (<>
    
//             <div style={{border: '5px solid black', width: 'fit-content', height: '100px', display: 'flex', flexDirection: 'row'}}>{d.map((item, i) => <div key={i} style={{border: '5px solid black', width: '50px', height: '100px'}}>{item}</div>)}</div>
//             <input ref={ref} onKeyDown={ONKEYDOWN}/>

//             </>)
// }


// export default App




// const App = () => { 

//     var words = ["can", "luke", "skywalker"]
//     const [index, setI] = useState(0)
//     var word = words.at(index)
//     const [count, setC] = useState(0)   
//     const [d, setD] = useState(Array(words[index].length).fill(null))


//     useEffect(() => {

//         const ONKEYDOWN = (e) => {

//         if(e.key.length === 1 && word.charAt(count) === e.key){
//             const newd = [...d]
//             if(count === word.length - 1){
//                 setC(0)
//                 setI(Math.floor(Math.random() * words.length))
//             }
//             else{
//                 newd[count] = e.key
//                 setD(newd)
//                 setC((pre) => pre + 1)
//             }
//         }

//     }

//      window.addEventListener("keydown", ONKEYDOWN)

//      return () => window.removeEventListener("keydown", ONKEYDOWN)

//     }, [count])


   
   
   
   
//     useEffect(() => {
//         setD(Array(words[index].length).fill(null))
//     }, [index])




//         return (<>
    
//             <div style={{border: '5px solid black', width: 'fit-content', height: '100px', display: 'flex', flexDirection: 'row'}}>{d.map((item, i) => <div key={i} style={{border: '5px solid black', width: '50px', height: '100px'}}>{item}</div>)}</div>

//             </>)




// }

// export default App


// import {useState, useEffect} from 'react'


// const App = () => {

//     const [y, seTy] = useState(0)
//     const [x, seTx] = useState(0)


//     const ONKEYDOWN = (e) => {

//         if(e.key.startsWith("Arrow") && x >= 0 && y >= 0){
//             switch(e.key){
//                 case "ArrowUp":
//                     console.log(e.key)
//                     seTy((pre) => pre - 10)
//                     console.log(y)
//                     break;
//                 case "ArrowDown":
//                     seTy((pre) => pre + 10)
//                     break;
//                 case "ArrowLeft":
//                     seTx((pre) => pre - 10)
//                     break;
//                 case "ArrowRight":
//                     seTx((pre) => pre + 10)
//                     break;
//                 default: 
//                     break;
//             }
//         }

//     }

//     useEffect(() => {
//         window.addEventListener("keydown", ONKEYDOWN)

//         return () => window.removeEventListener("keydown", ONKEYDOWN)
//     }, [y, x])



// return(<>

//             <div style={{position: "absolute", top: `${y}px`, left: `${x}px`}}>hello</div>

//         </>)

// }


// export default App



// const App = () => {


//     const [id, setId] = useState(0)
//     const [d, setD] = useState([])
//     const [e, setE] = useState(false)
//     const [l, setL] = useState(false)
    
//     const Submite = async(e) => {
//         e.preventDefault()
//         try{
//             const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`, {method: "GET"})
//             if(!res.ok){
//                 throw new Error("res bad")
//             } 
//             const data = await res.json()
//             setD(data)
//             setE(false)
//         }
//         catch(error){
//             console.error("Error submitting form:", error.message)
//             setE(true)
//         }
//         finally{
//             setL(false)
//         }
//     }


//     if(l){
//         return <div>...Loading</div>
//     }

//     return(<>
//             {d.length > 0 && d.map((item) => <div key={item.id}>{item.body}</div>)}
//             <form onSubmit={Submite}>
//                 <select onChange={(e) => setId(e.target.value)}>
//                     <option value={0}>0</option>
//                     <option value={1}>1</option>
//                     <option value={2}>2</option>    
//                 </select>
//                 <button type="submit">Submit</button>
//             </form>
//             </>)

// }

// export default App


// const App = () => {


//     const [data, setD] = useState([])
//     const [title, setT] = useState("")
//     const [content, setC] = useState("")
//     const [Utitle, setTu] = useState("")
//     const [Ucontent, setCu] = useState("")
//     const pload = {title: title, content: content}   

//     const deletef = (id) => {
//         const newd = data.filter((item) => item.id !== id)
//         localStorage.setItem('data', JSON.stringify(newd))   
//         setD(newd)
//     }
//     const updatef = (paylode) => {
//         const {id} = paylode
//         const newd = data.map((item) => item.id === id ? {...payload} : item)
//         localStorage.setItem('data', JSON.stringify(newd))
//         setD(newd)
//     }
//     const tooglef = (id) => {
//         const newd = data.map((item) => item.id === id ? {...item, state: !item.state} : item)
//         localStorage.setItem('data', JSON.stringify(newd))
//         setD(newd)
//     }

//     const makep = (payload) => {
//         const id = data.length + 1
//         const newd = [...data, {...payload, id: id}]
//         localStorage.setItem('data', JSON.stringify(newd))
//         setD(newd)    
//     }



//     const [search, setSearch] = useState("")

   
//         // const searchd = data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.content.toLowerCase().includes(search.toLowerCase()))
        
//         const searchd = data.map((item) => item.title.toLowerCase() === search.toLowerCase() ? item : null)




//     useEffect(() => {
//         const data = JSON.parse(localStorage.getItem('data'))
//         if(data){
//             setD(data)
//         }

//     }, [])



//     return(<>


//         <input type="text" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)}></input>

//         {searchd.length > 0 && searchd.map((item) => 
//         <div key={item.id} style={{border: "5px solid black", width: '100px', height: '100px', backgroundColor: item.state ? 'green': 'red'}}>
//             <h3>{item.title}</h3>
//             <p>{item.content}</p>
//             <button onClick={() => deletef(item.id)}>Delete</button>
//             <button onClick={() => tooglef(item.id)}>{item.state ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
//         </div>)}

//         <form onSubmit={() => makep(pload)}>
//             <label>Content:</label>
//             <input type="text" value={content} onChange={(e) => setC(e.target.value)}/>
//             <label>Title:</label>
//             <input type="text" value={title} onChange={(e) => setT(e.target.value)}/>
//             <button type="submit">make todo</button>
//         </form>


//         {data.length > 0 && data.map((item) => 
//         <div key={item.id} style={{border: "5px solid black", width: '100px', height: '100px', backgroundColor: item.state ? 'green': 'red'}}>
//             <h3>{item.title}</h3>
//             <p>{item.content}</p>
//             <button onClick={() => deletef(item.id)}>Delete</button>
//             <button onClick={() => tooglef(item.id)}>{item.state ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
//         </div>)}

//         {/* <form onSubmit={() => updatef({id: item.id, title: Utitle, content: Ucontent})}>
//             <label>Title:</label>
//             <input value={Utitle} type="text" onChange={(e) => setTu(e.target.value)}/>
//             <label>Content:</label>
//             <input value={Ucontent} type="text" onChange={(e) => setCu(e.target.value)}/>
//             <button type="submit">update</button>
//         </form> */}
        

//         {/* {data.length > 0 && data.map((item) => 
        
//         <form onSubmit={() => updatef({id: item.id, title: Utitle, content: Ucontent})}>
//             <label>Title:</label>
//             <input value={Utitle} type="text" onChange={(e) => setTu(e.target.value)}/>
//             <label>Content:</label>
//             <input value={Ucontent} type="text" onChange={(e) => setCu(e.target.value)}/>
//             <button type="submit">update</button>
//         </form>


//         )} */}

//         </>
//         )
// }


// export default App





// const data = [{item: "item1", content: "content1"}, {item: "item2", content: "content2"}, {item: "item3", content: "content3"}]

// const App = () => {

//     const [search, setSearch] = useState("")

//     const filterd = data.filter((item) => item.item.toLowerCase().includes(search.toLowerCase()) || item.content.toLowerCase().includes(search.toLowerCase()))

//     return(<>
    
//             <input type="text" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
//             {filterd.map((item, i) => 
//             <div key={i}>
//                 <h3>{item.item}</h3>
//                 <p>{item.content}</p>
//             </div>)}
            
//             </>)
// }

// export default App


// const App = () => {
//     const [d, setD] = useState(Array(9).fill(null))
//     const [turn, setT] = useState(true)
//     const [c, setC] = useState(0)
//     const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

//     const ONCLICK = (i) => {

//         if(d[i]) {

//             return null

//         }

//         if(c === 9){
//             alert("There was a draw")
//             setD(Array(9).fill(""))
//             setC(0)
//         }

//         const symbol = turn ? "X" : "O"
//         d[i] = symbol
//         setC((pre) => pre + 1)
//         setT(!turn)

//         for(let i = 0; i < 10; i++){
//             const [a,b,c] = win[i]
//             if(d[a] === "X" && d[b] === "X" && d[c] === "X"){
//                 alert("X won")
//                 setD(Array(9).fill(""))
//                 setC(0)
//         }
//             if(d[a] === "O" && d[b] === "O" && d[c] === "O"){
//                 alert("O won")
//                 setD(Array(9).fill(""))
//                 setC(0)
//         }

//     }
// }


//     return(<>
    
//             <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)", width: "fit-content", height: "fit-content", border: "5px solid black"}}>

//                 {d.map((item, i) => 
//                 <div style={{width: "100px", height: "100px", border: "5px solid black"}} key={i} onClick={() => ONCLICK(i)}>
//                     {item}
//                 </div>)}

//             </div>

//             </>)
// }


// export default App




// const App = () => {

//     const words = ["cat", "dart", "fan", "fart", "heart"]
//     const [index, setI] = useState(Math.floor(Math.random() * words.length))
//     const word = words.at(index)
//     const [c, setC] = useState(0)
//     const [d, setD] = useState(Array(word.length).fill(null))





//     const ONKEYDOWN = (e) => {

//         if(e.key.length === 1){
//             if(e.key === word.charAt(c)){
//                 const newd = [...d]
//                 newd[c] = e.key
//                 setD(newd)
//                 setC((c) => c+1)
//             }
//             if(c === word.length - 1){
//                 setI(Math.floor(Math.random() * words.length))
//                 setC(0)
//             }
//         }

//     }

//     useEffect(() => {
//         window.addEventListener("keydown", ONKEYDOWN)

//         return () => window.removeEventListener("keydown", ONKEYDOWN)
//     }, [c])


//     useEffect(() => {
//         setD(Array(word.length).fill(null))
//     }, [index])

    

//     return(<>
    
//             <div style={{width: "fit-content", height: "fit-content", border: "5px solid black", display: "flex", flexDirection: "row"}}>
//                 {d.map((item, i) => <div style={{width: "100px", height: "100px", border: "5px solid black"}} key={i}>{item}</div>)}
//             </div>
//             {/* <input onKeyDown={ONKEYDOWN}/> */}

//             </>)


// }

// export default App

import {useState, useEffect, useCallback} from 'react'

const th = (fn, t) => {
    let time = false

    return (...args) => {
        if(time){
            return null
        }
        fn(...args)
        setTimeout(() => {
            time = false
        }, t)
    }
}

const App = () => {

    const [offset, setO] = useState(1)
    const [d, setD] = useState([])

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${offset}`).then((res) => { return res.json()}).then((data) => setD((pre) => [...pre, data]))
    }, [])

    const fetchd = useCallback(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${offset}`).then((res) => { return res.json()}).then((data) => setD((pre) => [...pre, data]))
    }, [offset])

    const handleScroll = useCallback(
    th(() => {
      const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
      
      // Check if we are near the bottom
      if (clientHeight + scrollTop >= scrollHeight - 5) {
        setO((pre) => pre + 1);
        fetchd();
      }
    }, 1000),
    [fetchd] // Dependencies for the callback
  );

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll])



return (
  <>
    {d.map((post, i) => (
      <div key={i} style={{ border: "1px solid #ccc", padding: "500px", margin: "500px" }}>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    ))}
  </>
);


}


export default App