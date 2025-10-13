import Link from 'next/link'
import React from 'react'
import { IoIosArrowRoundForward } from 'react-icons/io'
import ProductCard from './ProductCart'
import axios from 'axios'

const FeaturedProduct = async({category,title,tag}) => {

   const collection = encodeURIComponent(category);
const { data: productData } = await axios.get(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-product?category=${collection}`
);
console.log(productData.data)
    if(!productData ){
        return null
    }
    
  return (
    <section>
        <div className=' flex justify-between md:mt-6 mt-2 items-center mb-4 md:px-12 px-4'>
            <h2 className='text-2xl font-semibold sm:text-4xl'>{title}</h2>
            <Link
            className='flex justify-center items-center   underline hover:text-primary'
            href={""}>
            View All
            <IoIosArrowRoundForward />
            </Link>
        </div>
         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-3 md:px-10'>
            
            {
                !productData ? (
                    <div>Data not found</div>
                ):(

                  productData?.data?.map((data)=>(
                      <ProductCard tag={tag} key={data._id} product={data}/>
                  ))

                )
            }
        </div>
    </section>
  )
}

export default FeaturedProduct