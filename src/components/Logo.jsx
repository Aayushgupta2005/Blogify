import React from 'react'
import myImage from '../assets/logoImg.webp';
function Logo({width = '100px'}) {
  return (
    <div className='flex items-center justify-center gap-3'>
      <img src = {myImage} className='w-10 h-10 rounded-full' alt="" />
      <h3 className='font-bold'>Blogify</h3>
    </div>
  )
}

export default Logo