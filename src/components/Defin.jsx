import {configureStore} from "@reduxjs/toolkit"
import C from "./Create.jsx"

const store = configureStore({
    reducer: {
        counter: C
    }
})


export default store