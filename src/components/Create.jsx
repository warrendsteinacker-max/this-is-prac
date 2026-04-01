import { createSlice } from "@reduxjs/toolkit"

const C = createSlice({
    name: "counter",
    initialState: {value: 0},
    reducers: {
        I: (state) => {
            state.value = state.value + 1
        },
        D: (state) => {
            state.value = state.value - 1
        },
        CC: (state, action) => {
            state.value = action.payload
        }
    }
})

export const {I,D,CC} = C.actions
export default C.reducer







