// import {useSelector, useDispatch} from "react-redux"
// import {I, D, CC} from "./Create.jsx"


// const New = () => {
//     const val = useSelector((state) => state.counter.value)
//     const DD = useDispatch()

//     function FUNC() {
//         DD(I())
//     }

//     function FUNC2() {
//         DD(D())
//     }

//     function FUNC3(e) {
//         DD(CC(e.target.value))
//     }


//     return(<>
//             <div>{val}</div>
//             <button onClick={FUNC}>+</button>
//             <button onClick={FUNC2}>-</button>
//             <input type="number" onChange={FUNC3}/>
//             </>)
// }

// export default New






import {useSelector, useDispatch} from "react-redux"
import {useEffect} from "react"
import {fetchD} from "./Create.jsx"
import {filterData} from "./Create.jsx"


const New = () => {
let Fdata = useSelector((state) => state.counter.filterD)
const data = useSelector((state) => state.counter.data)
const dis = useDispatch()

useEffect(() => {
    dis(fetchD())
}, [])




const FUNC = (e) => {
    if(e.target.value === ""){
        window.location.reload()
        return
    }
    dis(filterData(e.target.value))
}

return(<>
        <h1>Filter data</h1>
        <input type="text" placeholder="enter userId" onChange={FUNC}/>

        {Fdata.length > 0 ? Fdata.map((item) => <div key={item.id}>{item.userId}</div>) : <div>no data</div>}
        </>)
}


export default New