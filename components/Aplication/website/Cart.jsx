import React from 'react'
import { BsCart2 } from 'react-icons/bs'

const Cart = () => {
  return (
    <button type='button'>
        <BsCart2  className="text-zinc-500 hover:text-primary  cursor-pointer" size={20}/>
    </button>
  )
}

export default Cart