const Istate = {count: 0, name: "John"}


function reducer(state = Istate, action){
    switch(action.type){
        case "+":
            return{...state, count: state.count + 1}
        case "-":
            return{...state, count: state.count - 1}
        case "name":
            return{...state, name: action.payload}
        default:
            return state
    }
}

export default reducer