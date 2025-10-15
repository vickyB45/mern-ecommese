'use client'
import Filter from '@/components/Aplication/website/Filter'
import Sorting from '@/components/Aplication/website/Sorting'
import WebsiteBreadcrumb from '@/components/Aplication/website/WebsiteBreadcrumb'
import {  WEBSITE_MEN_COLLECTION } from '@/routes/WebsiteRoute'
import React, { useState } from 'react'

const breadCrumb = {
    title:'Men Collections',
    links:[
        {
            label:"Men Collections",
            href:WEBSITE_MEN_COLLECTION
        }
    ]
}

const ShopPage = () => {
  const [limit,setLimit] = useState(9)
  return (
    <div>
        <WebsiteBreadcrumb props={breadCrumb}/>

       <section className='lg:flex lg:px-30 px-4 my-20'>
         <div className='w-72 me-4'>
          <div className='sticky top-0 bg-gray-50 p-4 rounded'>
            <Filter />
          </div>
        </div>
        <div className='w-[calc(100%-18rem)]'>
          <Sorting  limit={limit} setLimit={setLimit}/>
        </div>
       </section>
    </div>
  )
}

export default ShopPage