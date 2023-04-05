import React, { useState, useEffect } from 'react'

const Connect = () => {
    const [ data, setData ] = useState([ {} ])
    useEffect(() => {
        fetch("/members").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
                
        )
    }, [])


        async function Submit () {
            const response = await fetch("/send", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify("todo")
            })
            if (response.ok) {
                console.log("it worked")
            }
        }
    
    
  return (
      <div>
          Connect
          {(typeof data.members === "undefined")
              ? (<p>Loading....</p>)
              : data.members.map((member, i) => (
                  <p key={i}>{member}</p>
              ))
          }
          <button onClick={Submit}></button>
          
    </div>
  )
}

export default Connect;
