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
        const res = await fetch("https://api.thedogapi.com/v1/breeds", {method: "GET", headers: {"x-api-key" : "live_WQSPyRX2bHJaUvdSgSc0k15mJLDqd0AUoYILOrB479WhXwcZQkv4uqgAtZWiFdVN", "Content-Type": "application/json"}})

        if(!res.ok){
            return true
        }
        const DD = await res.json()

        console.log(DD)

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
            const newD = state.data.filter((item) => item.name.toLowerCase().includes(action.payload.toLowerCase()))
            console.log(action.payload)
            console.log(typeof(action.payload))
            state.filterD = newD
        },
        AlphS: (state, action) => {
            const newd = state.data.filter((item) => item.name.split("")[0].toLowerCase() === action.payload)
            state.filterD = newd
            if(action.payload === "all"){
                state.filterD = state.data
            }
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

export const {filterData, AlphS} = Slice.actions
export default Slice.reducer



