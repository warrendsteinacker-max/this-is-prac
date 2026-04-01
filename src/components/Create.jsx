// import { createSlice } from "@reduxjs/toolkit"

// const C = createSlice({
//     name: "counter",
//     initialState: {value: 0},
//     reducers: {
//         I: (state) => {
//             state.value = state.value + 1
//         },
//         D: (state) => {
//             state.value = state.value - 1
//         },
//         CC: (state, action) => {
//             state.value = action.payload
//         }
//     }
// })

// export const {I,D,CC} = C.actions
// export default C.reducer










import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"


export const fetchD = createAsyncThunk(
    "data f",
    async() => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts")
        
        if(!res.ok){
            return true
        }
        const DD = await res.json()

        return DD
    }
)


const Slice = createSlice({
    name: "C",
    initialState: {
        val: 0,
        data: [],
        filterD: [],
        E: false,
    },
    reducers: {
        filterData: (state, action) => {
            const newD = state.data.filter((item) => item.userId === Number(action.payload))
            console.log(newD)
            console.log(Object)
            console.log(action.payload)
            console.log(typeof(action.payload))
            state.filterD = newD
        }
    },
    extraReducers:
        (builder) => {
            builder.addCase(fetchD.fulfilled, (state, action) => {
                state.data = action.payload
                state.filterD = state.data 
                state.E = false
            }).addCase(fetchD.rejected, (state, action) => {
                state.E = action.payload
            })
        }
    
})

export const {filterData} = Slice.actions
export default Slice.reducer



