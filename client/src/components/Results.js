import React, { useState, useEffect } from 'react'
import Image from "./Image";

function Results() {
    const [ data, setData ] = useState([ {} ])
    useEffect(() => {
        fetch("/results").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }

        )
    }, [])

    return (
        <div>
            {(typeof data.members === "undefined")
                ? (<p>Loading....</p>)
                : <Image />
            }
           
        </div>
    )
}

export default Results;