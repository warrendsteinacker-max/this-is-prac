// import {useState, useEffect} from 'react'


// const Prac = () => {

//     const [G, setG] = useState(0)
//     const [D, setD] = useState([])
//     const [Gcount, setGc] = useState([])
//     const [time, setT] = useState(false)
//     const win = D.every((item) => item.status === true)

//     const func = (e) => {
//         e.preventDefault()
//         if(G > 0 && G < 6){
//             const Tcards = G*2
//             const g = Math.floor(Tcards/2)
//             const garray = [...Array(g).fill(null)].map((_, index) => index+1)
//             const gd = [...garray, ...garray].sort(() => Math.random() - 0.5)
//             const copy = [...gd]
//             const newgd = copy.map((item, index) => { return {p: index, i: item, status: false}})
//             setD(newgd)
//         }
//         else{
//             alert('The number of guesses needs to be between 0 and 6 do not enter letters')
//         }
//     }

//     const func2 = (id) => {

//         if(time){
//             return null
//         }

//         const getitem = D.find((item) => item.p === id)
//         const newone = {p: getitem.p, i: getitem.i, status: true}
//         const newdg = D.map((item) => item.p === id ? newone : item)
//         // setD(newdg)
//         setGc((pre) => [...pre, newone])
//         const win = D.every((item) => item.status === true)
//             if(Gcount.length === 1){
//                 setT(true)

//                 if(Gcount[0].i !== getitem.i){
//                     const secnewdg = D.map((item) =>{
//                         if(item.p === Gcount[0].p || item.p === getitem.p){
//                             return {p: item.p, i: item.i, status: false}}
//                         else{
//                             return item
//                         }})
//                         setTimeout(() => {
//                             setD(secnewdg)
//                             setGc([])
//                             setT(false)
//                         }, 5000)
//                     }
//                 }
//         //     if(win){
//         //         alert("you won")
//         //         const Tcards = G*2
//         //         const g = Math.floor(Tcards/2)
//         //         const garray = [...Array(g).fill(null)].map((_, index) => index+1)
//         //         const gd = [...garray, ...garray].sort(() => Math.random() - 0.5)
//         //         const copy = [...gd]
//         //         const newgd = copy.map((item, index) => { return {p: index, i: item, status: false}})
//         //         setD(newgd)
//         //  }
//     }






//   return (
//     <>
//     <form onSubmit={func}>
//         <input value={G} onChange={(e) => setG(parseInt(e.target.value))} />
//         <button type='submit'>Start Game</button>
//     </form>
    

//     <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', width: 'fit-content', height: 'fit-content'}}>
//         {D.length > 0 && D.map((item, index) => <div key={index} onClick={() => func2(item.p)} style={{width: '50px', height: '50px', border: '3px solid red'}}>{item.status ? item.i : ""}</div>)}
//     </div>
//     </>
//   )
// }

// export default Prac


// import {useState} from 'react'



// const Prac = () => {


// const [N, setN] = useState(false)
// const [L, setL] = useState(false)
// const [U, setU] = useState(false)
// // const [Char, setC] = useState([])
// const [P, setP] = useState([])



// const func = (e) => {

//     e.preventDefault()
    
//     let chars = []
//     if(N){
//         chars = [...chars, 1,2,3,4,5,6,7,8,9,0]
//     }
//     if(L){
//         chars = [...chars, "A","Q","W","E","R","T","Y","U","I"]
//     }
//     // if(U){

//     // }

//     const PP = Array(10).fill(null)

//     const pas = PP.map(() => {let R = Math.floor(Math.random() * 19); return chars[R]}).join("")

//     console.log(typeof(pas))


//     setP(pas)
    
// }



//   return (
//     <>
//     <h1>{P}</h1>
//     <form onSubmit={func}>
//     {/* <lable for="Numbers"></lable> */}
//     <input type="checkbox" name="Numbers" onChange={() => setN(!N)}></input>
//     {/* <lable for="L"></lable> */}
//     <input type="checkbox" name="L" onChange={() => setL(!L)}></input>
//     <lable for="1">lowercase</lable>
//     <input id="1" type="radio" name="U" onChange={() => setU(!U)}></input>
//     <button type="submit">make password</button>
//     </form>
//     </>
//   )
// }

// export default Prac

let dNum = Number(document.getElementById(dice).value) ///cahnge this to const for testing
const roles = [1,2,3,4,5,6]
const tracking = []
let start = true
let reset = false


function setDN(e){
  dNum = e.target.value
}


function startG(){
  if(start && dNum > 0){  
    for(let i = 0; i < dNum; i++){
      const el = docuemnt.createElement("div")
      el.id = i
      el.style.width = "100px"
      el.style.height = "100px" ////remove styles for testing
      el.style.border = "5px solid black"
      tracking.push(i)
      el.textContent = Math.floor(Math.random() * 6)
      document.body.appendChild(el)
    }
      start = false;
      reset = true;
  }
    else{
      alert("you must reset the gem befor starting or you have to enter a number of dice")
    }
  }


function resetG(){

  if(reset){
    for(let i = 0; i < tracking.length; i++){
      const el = docuemnt.getElementById(tracking[i])
      
      // document.body.removeElement(el)
    }
      start = true;
      reset = false;
      dNum = 0
      // tracking = []
  }
  else{
    alert("you must start a game")
  }

}
///////////////
// notes for portion above need to remember scopes of declerations style to get to styles 
////////////////

let statusdiv = docuemnt.getElementById("stats") /////put this back to this for prac docuemnt

async function makeget(){
    try{
      const res = await fetch('url')

      if(!res.ok){
        throw new Error('bad res')
      }

      const data = await res.json()
      if(data.length > 0){
        for(i = 0; i < data.length; i++){     ///////cahnge this back to lenght for prac
          const el = document.createElement("div")
          el.style.border = "5px solid black"
          el.textContent = data[i].name      //////////put this back to this for prac
          document.body.appendChild(el)
        }
      }
      statusdiv.textContent = ""
    }
    catch(error){
      statusdiv.textContnet = "Error try again"
    }
  }



////////////////////////////////////////////////////////////////////
/////////////////third prac file/////////////////////////////////////
///////////////////////////////////////////////////////////////////

const ell = document.createElement("div")

ell.style.width = "fit-content"
ell.style.height = "fit-content"
ell.style.border = "5px solid black"
ell.style.display = "grid"
ell.style.gridTemplateColumns = "repeat(3, 1rf)" 
ell.style.gridTemplateRows = "repeat(3, 1rf)"
ell.id = "game"

document.body.appendChild(ell)

let DC;

let GC; 

let turnC = []

let Dtracking = [];

let display;

function makeGC(e){
  GC = Number(e.target.value);
};

function functionMD(e){
  if(GC > 0){
    e.preventDefault();
    DC = GC * 2
    const gc = Math.floor(DC/2)
    const Narray = Array(gc).fill(null).map((_, index) => { return {content: index, status: false}}) ////always include _ in emptey array
    const display = [...Narray, ...Narray].sort(() => Math.random() - 0.5)

    for(let i = 0; 0 < display.length; i++){
      const el = document.createElement("div");
      el.style.width = "100px"
      el.style.height = "100px"
      el.style.border = "5px solid black"
      // el.textContent = 
      el.textContent = ""
    }
  }
  else{
    alert("must make a guess count")
  }


}



