import { ADMIN_CATEGORY_ADD, ADMIN_COUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from '@/routes/AdminPannelRoute'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlinePermMedia } from 'react-icons/md'
import { RiCoupon2Line } from 'react-icons/ri'

const QuickAdd = () => {
  return (
       <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-4 gap-2 xl:gap-8 mt-4 md:mt-8">
        <Link href={ADMIN_CATEGORY_ADD}>
            <div className='flex justify-between py-4 md:py-4 items-center bg-gradient-to-tr from-green-400 via-green-500 to-green-600 p-2 md:p-4 rounded-lg'>
                <h4 className='text-white dark:text-black'>Add Category</h4>
                <span className='w-10 h-10 rounded-full border shadow-lg  text-white dark:text-black flex justify-center items-center'><BiCategory  /></span>
            </div>
        </Link>
        <Link href={ADMIN_PRODUCT_ADD}>
            <div className='flex justify-between py-4 md:py-4 items-center bg-gradient-to-tr from-red-400 via-red-500 to-red-600 p-2 md:p-4 rounded-lg'>
                <h4 className='text-white dark:text-black'>Add Product</h4>
                <span className='w-10 h-10 rounded-full border shadow-lg  text-white dark:text-black flex justify-center items-center'><IoShirtOutline  /></span>
            </div>
        </Link>
        <Link href={ADMIN_COUPON_ADD}>
            <div className='flex justify-between py-4 md:py-4 items-center bg-gradient-to-tr from-cyan-500 via-cyan-600 to-cyan-700 p-2 md:p-4 rounded-lg'>
                <h4 className='text-white dark:text-black'>Add Coupon</h4>
                <span className='w-10 h-10 rounded-full border shadow-lg  text-white dark:text-black flex justify-center items-center'><RiCoupon2Line  /></span>
            </div>
        </Link>
        <Link href={ADMIN_MEDIA_SHOW}>
            <div className='flex justify-between py-4 md:py-4 items-center bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-600 p-2 md:p-4 rounded-lg'>
                <h4 className='text-white dark:text-black'>Upload Media</h4>
                <span className='w-10 h-10 rounded-full border shadow-lg  text-white dark:text-black flex justify-center items-center'><MdOutlinePermMedia  /></span>
            </div>
        </Link>
    </div>
  )
}

export default QuickAdd