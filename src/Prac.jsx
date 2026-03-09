import {useState} from 'react'


const Prac = () => {

    const [G, setG] = useState(0)

    const func
  return (
    <>
    <form onSubmit={}>
        <input value={G} onChange={() => setG(parseInt(e.target.value))} />
        <button type='submit'>Start Game</button>
    </form>
    

    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1rf)', gridTemplateRows: 'repeat(3, 1rf)', width: 'fit-content', height: 'fit-content'}}>

    </div>
    </>
  )
}

export default Prac