"use client"
import React, {useEffect} from "react"

export default function Error({error, reset}: {error: Error; reset: () => void}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{padding: "2rem", maxWidth: "40rem", margin: "0 auto", fontFamily: "system-ui"}}>
      <h2>Something went wrong!</h2>
      <p style={{color: "#b91c1c", wordBreak: "break-word"}}>{error.message}</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  )
}
