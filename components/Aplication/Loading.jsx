import React from 'react'
import Image from 'next/image'

const Loading = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
        <Image src="/assets/images/loading.svg" height={60} width={60} alt='loading'/>
    </div>
  )
}

export default Loading