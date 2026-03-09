import {useState} from 'react'


const Prac = () => {

    const [G, setG] = useState(0)
    const [D, setD] = useState([])

    const func = () => {
        if(G > 0 && G < 6){
            const Tcards = g*2
            const g = Math.floor(Tcards/2)
            const garray = [...Array(g).fill(null)].map((i) => i+1)
            const gd = [...garray, ...garray].sort(() => Math.random() - 0.5)
            setD(gd)
        }

        alert('The number of guesses needs to be between 0 and 6 do not enter letters')
    }
  return (
    <>
    <form onSubmit={func}>
        <input value={G} onChange={() => setG(parseInt(e.target.value))} />
        <button type='submit'>Start Game</button>
    </form>
    

    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1rf)', gridTemplateRows: 'repeat(3, 1rf)', width: 'fit-content', height: 'fit-content'}}>
        {D.length > 0 && D.map((item) => <div style={{width: '50px', height: '50px'}}>{item}</div>)}
    </div>
    </>
  )
}

export default Prac