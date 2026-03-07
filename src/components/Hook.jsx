import {useEffect, useState} from 'react'


const Hook = () => {
    const [E, setE] = useState(false)
    const [L, setL] = useState(false)
    const [D, setD] = useState([])


    useEffect(() => {
        setL(true)

        const fetchd = async() => {
            try{
                const res = await fetch('url')

                if(!res.ok){
                    throw new Error('res bad')
                }

                const data = await res.json()

                setD(data)
                setE(false)
            }
            catch(error){
                setE(true)
                console.error(error.message)
            }
            finally{
                setL(false)
            }
        }

        fetchd()

    }, [])


    return{E, L, D}
}


export default Hook