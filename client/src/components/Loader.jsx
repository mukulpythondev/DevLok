import React from 'react'
import { Hearts } from 'react-loader-spinner';
const Loader = () => {
  return (
    <div className='bg-black-100 h-screen w-full flex items-center justify-center'>
        <Hearts
  height="80"
  width="80"
  color="#ff69df"
  ariaLabel="hearts-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />
    </div>
  )
}

export default Loader