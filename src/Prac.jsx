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


import {useState} from 'react'



const Prac = () => {


const [N, setN] = useState(false)
const [L, setL] = useState(false)
const [U, setU] = useState(false)
// const [Char, setC] = useState([])
const [P, setP] = useState([])



const func = (e) => {

    e.preventDefault()
    
    let chars = []
    if(N){
        chars = [...chars, 1,2,3,4,5,6,7,8,9,0]
    }
    if(L){
        chars = [...chars, "A","Q","W","E","R","T","Y","U","I"]
    }
    // if(U){

    // }

    const PP = Array(10).fill(null)

    const pas = PP.map(() => {let R = Math.floor(Math.random() * 19); return chars[R]}).join("")

    console.log(typeof(pas))


    setP(pas)
    
}



  return (
    <>
    <h1>{P}</h1>
    <form onSubmit={func}>
    {/* <lable for="Numbers"></lable> */}
    <input type="checkbox" name="Numbers" onChange={() => setN(!N)}></input>
    {/* <lable for="L"></lable> */}
    <input type="checkbox" name="L" onChange={() => setL(!L)}></input>
    <lable for="1">lowercase</lable>
    <input id="1" type="radio" name="U" onChange={() => setU(!U)}></input>
    <button type="submit">make password</button>
    </form>
    </>
  )
}

export default Prac