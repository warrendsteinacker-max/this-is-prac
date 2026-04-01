import {useSelector, useDispatch} from "react-redux"
import {I, D, CC} from "./Create.jsx"


const New = () => {
    const val = useSelector((state) => state.counter.value)
    const DD = useDispatch()

    function FUNC() {
        DD(I())
    }

    function FUNC2() {
        DD(D())
    }


    return(<>
            <div>{val}</div>
            <button onClick={FUNC}>-</button>
            <button onClick={FUNC2}>+</button>
            </>)
}

export default New