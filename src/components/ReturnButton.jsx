import React from 'react'
import { Link } from "react-router";


const ReturnButton = () => {
  return (
    <div className='flex flex-row  justify-end mb-2'>
      <Link to="/">
        <div className='return-button'>
          <img src='return-button.png' alt='return icon' />
          <p>Return</p>
        </div>
      </Link>
    </div>
  )
}

export default ReturnButton