import React from 'react'
import { Link } from 'react-router-dom'

const FallbackScreen = () => {
  return (
    <div className="container text-center fallback ">
      <h1 className="fallback-h1">Something went wrong</h1>
      {/* <Link to={'/'}> */}
      <h2>
        Go back to
        <Link to={'/'}>
          <span className="fallback-home mx-2 ">homepage</span>
        </Link>
      </h2>
      {/* </Link> */}
    </div>
  )
}

export default FallbackScreen
