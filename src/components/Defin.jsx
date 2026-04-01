// import {configureStore} from "@reduxjs/toolkit"
// import C from "./Create.jsx"

// const store = configureStore({
//     reducer: {
//         counter: C
//     }
// })


// export default store













import Slice from "./Create.jsx"
import {configureStore} from "@reduxjs/toolkit"


export const store = configureStore({
    reducer:{
        counter: Slice
    }
})


