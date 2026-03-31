import { useContext } from "react"
import {Con} from "./ReportBuilder.jsx"

const C = () => {
    const {me} = useContext(Con)
    
    
    return <div>{me}</div>
}

export default C







