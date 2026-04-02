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






// import {useSelector, useDispatch} from "react-redux"
// import {useEffect} from "react"
// import {fetchD} from "./Create.jsx"
// import {filterData} from "./Create.jsx"


// const New = () => {
// let Fdata = useSelector((state) => state.counter.filterD)
// const dis = useDispatch()

// useEffect(() => {
//     dis(fetchD())
// }, [])




// const FUNC = (e) => {
//     if(e.target.value === ""){
//         window.location.reload()
//         return
//     }
//     dis(filterData(e.target.value))
// }

// return(<>
//         <h1>Filter data</h1>
//         <input type="text" placeholder="enter userId" onChange={FUNC}/>

//         {Fdata.length > 0 ? Fdata.map((item) => <div key={item.id}>{item.userId}</div>) : <div>no data</div>}
//         </>)
// }


// export default New





// const partd = [
//   { id: 101, userId: 1, city: "Cadillac", temp: 42 },
//   { id: 102, userId: 2, city: "Detroit", temp: 48 },
//   { id: 103, userId: 1, city: "McBain", temp: 40 },
//   { id: 104, userId: 3, city: "Grand Rapids", temp: 45 },
//   { id: 105, userId: 2, city: "Marion", temp: 38 },
//   { id: 106, userId: 4, city: "Traverse City", temp: 41 },
//   { id: 107, userId: 1, city: "Mantone", temp: 39 },
//   { id: 108, userId: 5, city: "Lansing", temp: 46 },
//   { id: 109, userId: 3, city: "Big Rapids", temp: 43 },
//   { id: 110, userId: 2, city: "Houghton Lake", temp: 37 },
//   { id: 111, userId: 6, city: "Ann Arbor", temp: 44 },
//   { id: 112, userId: 7, city: "Flint", temp: 41 },
//   { id: 113, userId: 1, city: "Kalamazoo", temp: 43 },
//   { id: 114, userId: 8, city: "Saginaw", temp: 39 },
//   { id: 115, userId: 4, city: "Midland", temp: 40 },
//   { id: 116, userId: 2, city: "Muskegon", temp: 42 },
//   { id: 117, userId: 9, city: "Bay City", temp: 38 },
//   { id: 118, userId: 5, city: "Jackson", temp: 45 },
//   { id: 119, userId: 1, city: "Holland", temp: 44 },
//   { id: 120, userId: 3, city: "Battle Creek", temp: 46 },
//   { id: 121, userId: 10, city: "Port Huron", temp: 37 },
//   { id: 122, userId: 6, city: "Marquette", temp: 32 },
//   { id: 123, userId: 7, city: "Sault Ste. Marie", temp: 30 },
//   { id: 124, userId: 8, city: "Petoskey", temp: 35 },
//   { id: 125, userId: 1, city: "Charlevoix", temp: 36 },
//   { id: 126, userId: 4, city: "Gaylord", temp: 33 },
//   { id: 127, userId: 2, city: "Alpena", temp: 34 },
//   { id: 128, userId: 9, city: "Escanaba", temp: 31 },
//   { id: 129, userId: 5, city: "Iron Mountain", temp: 29 },
//   { id: 130, userId: 1, city: "Manistee", temp: 38 },
//   { id: 131, userId: 3, city: "Ludington", temp: 39 },
//   { id: 132, userId: 10, city: "Cheboygan", temp: 32 },
//   { id: 133, userId: 6, city: "St. Ignace", temp: 31 },
//   { id: 134, userId: 1, city: "Mackinaw City", temp: 33 },
//   { id: 135, userId: 7, city: "Newberry", temp: 28 },
//   { id: 136, userId: 4, city: "Munising", temp: 30 },
//   { id: 137, userId: 2, city: "Houghton", temp: 27 },
//   { id: 138, userId: 8, city: "Copper Harbor", temp: 25 },
//   { id: 139, userId: 9, city: "Menominee", temp: 32 },
//   { id: 140, userId: 1, city: "Tawas City", temp: 36 },
//   { id: 141, userId: 5, city: "Oscoda", temp: 35 },
//   { id: 142, userId: 3, city: "Grayling", temp: 34 },
//   { id: 143, userId: 6, city: "Roscommon", temp: 35 },
//   { id: 144, userId: 10, city: "West Branch", temp: 37 },
//   { id: 145, userId: 1, city: "Gladwin", temp: 38 },
//   { id: 146, userId: 4, city: "Harrison", temp: 36 },
//   { id: 147, userId: 2, city: "Clare", temp: 39 },
//   { id: 148, userId: 7, city: "Mt. Pleasant", temp: 41 },
//   { id: 149, userId: 8, city: "Alma", temp: 40 },
//   { id: 150, userId: 1, city: "Ithaca", temp: 41 },
//   { id: 151, userId: 9, city: "St. Johns", temp: 42 },
//   { id: 152, userId: 5, city: "Owosso", temp: 40 },
//   { id: 153, userId: 3, city: "Corunna", temp: 40 },
//   { id: 154, userId: 6, city: "Durand", temp: 41 },
//   { id: 155, userId: 1, city: "Howell", temp: 43 },
//   { id: 156, userId: 10, city: "Brighton", temp: 44 },
//   { id: 157, userId: 4, city: "Fenton", temp: 42 },
//   { id: 158, userId: 2, city: "Grand Blanc", temp: 41 },
//   { id: 159, userId: 7, city: "Lapeer", temp: 40 },
//   { id: 160, userId: 8, city: "Imlay City", temp: 39 },
//   { id: 161, userId: 1, city: "Bad Axe", temp: 35 },
//   { id: 162, userId: 9, city: "Sandusky", temp: 37 },
//   { id: 163, userId: 5, city: "Caro", temp: 38 },
//   { id: 164, userId: 3, city: "Vassar", temp: 39 },
//   { id: 165, userId: 6, city: "Frankenmuth", temp: 40 },
//   { id: 166, userId: 1, city: "Chesaning", temp: 40 },
//   { id: 167, userId: 10, city: "St. Charles", temp: 39 },
//   { id: 168, userId: 4, city: "Hemlock", temp: 39 },
//   { id: 169, userId: 2, city: "Merrill", temp: 38 },
//   { id: 170, userId: 7, city: "Breckenridge", temp: 39 },
//   { id: 171, userId: 8, city: "Wheeler", temp: 39 },
//   { id: 172, userId: 1, city: "St. Louis", temp: 40 },
//   { id: 173, userId: 9, city: "Shepherd", temp: 41 },
//   { id: 174, userId: 5, city: "Rosebush", temp: 40 },
//   { id: 175, userId: 3, city: "Farwell", temp: 38 },
//   { id: 176, userId: 6, city: "Lake", temp: 37 },
//   { id: 177, userId: 1, city: "Sears", temp: 36 },
//   { id: 178, userId: 10, city: "Evart", temp: 37 },
//   { id: 179, userId: 4, city: "Hersey", temp: 38 },
//   { id: 180, userId: 2, city: "Reed City", temp: 39 },
//   { id: 181, userId: 7, city: "LeRoy", temp: 36 },
//   { id: 182, userId: 8, city: "Tustin", temp: 35 },
//   { id: 183, userId: 1, city: "Boon", temp: 37 },
//   { id: 184, userId: 9, city: "Harrietta", temp: 38 },
//   { id: 185, userId: 5, city: "Mesick", temp: 39 },
//   { id: 186, userId: 3, city: "Buckley", temp: 40 },
//   { id: 187, userId: 6, city: "Kingsley", temp: 41 },
//   { id: 188, userId: 1, city: "Grawn", temp: 40 },
//   { id: 189, userId: 10, city: "Interlochen", temp: 39 },
//   { id: 190, userId: 4, city: "Lake Ann", temp: 39 },
//   { id: 191, userId: 2, city: "Honor", temp: 38 },
//   { id: 192, userId: 7, city: "Beulah", temp: 39 },
//   { id: 193, userId: 8, city: "Benzonia", temp: 39 },
//   { id: 194, userId: 1, city: "Frankfort", temp: 40 },
//   { id: 195, userId: 9, city: "Elberta", temp: 39 },
//   { id: 196, userId: 5, city: "Arcadia", temp: 38 },
//   { id: 197, userId: 3, city: "Onekama", temp: 39 },
//   { id: 198, userId: 6, city: "Bear Lake", temp: 38 },
//   { id: 199, userId: 1, city: "Kaleva", temp: 39 },
//   { id: 200, userId: 10, city: "Wellston", temp: 38 }
// ];

// import {useEffect, useState} from "react"

// // import {filterData} from "./Create.jsx"


// const New = () => {

// const [offset, setOff] = useState(5)
// const [ppartd, setPd] = useState([])


// useEffect(() => {

//     setPd([partd[offset - 5], partd[offset - 4], partd[offset - 3], partd[offset - 2], partd[offset - 1]])

//     console.log(ppartd)
// }, [])



// const FUNC = () => {
//     const {scrollTop, scrollHeight, clientHeight} = document.documentElement

//     if(scrollTop + scrollHeight >= clientHeight - 100){
//         setOff((pre) => pre + 5)
//         setPd((pre) => [...pre, partd[offset - 5], partd[offset - 4], partd[offset - 3], partd[offset - 2], partd[offset - 1]])
//     }
// }



// useEffect(() => {

//     window.addEventListener("scroll", FUNC)

//     return () => window.removeEventListener("scroll", FUNC)

// }, [offset])

// return(<>
        
//         {ppartd.length > 0 ? ppartd.map((item) => <div key={item.id}>{item.userId}</div>) : <div>no data</div>}
//         </>)
// }


// export default New



const DogSearch = () => {


    return(<>
    
            <h1 style={{textDecoration: "underline", fontSize: "20px"}}>Dog Seach</h1>
            <form>
                <input type="text" placeholder="search for dog type"/>
            </form>
    
            </>)
}


export default DogSearch