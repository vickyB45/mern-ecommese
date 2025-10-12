import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import SearchModel from './SearchModel'


const AdminSearch = () => {

    const [open,setOpen]= useState(false)

  return (
    <div className=' md:w-[300px]'>
        <div className='flex justify-between items-center relative'>
            <Input onClick={()=>setOpen(true)} readOnly className="rounded-full cursor-pointer " placeholder="Search..."/>
        <button className='absolute right-3  cursor-default' type='button'>
            <IoIosSearch size={20} />
        </button>
        </div>
        <SearchModel open={open} setOpen={setOpen}/>
    </div>
  )
}

export default AdminSearch  