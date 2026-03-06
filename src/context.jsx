import {createContext, useState} from "react";


export const CONTEXT = createContext(null)

const ContextP = ({children}) => {


    const [qurey, setQ] = useState("")

    const func = (e) => {
        e.preventDefault()
        try{

        }
        catch(error){
            console.log(error.message)
        }
    }


    return(<CONTEXT.Provider>{children}</CONTEXT.Provider>)
}

export default ContextP