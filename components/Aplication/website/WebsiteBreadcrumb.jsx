import { WEBSITE_HOME } from '@/routes/WebsiteRoute'
import { Link } from '@mui/material'
import React from 'react'


const WebsiteBreadcrumb = ({props}) => {
    console.log(props)
  return (
    <div className={`py-10 flex justify-center items-center bg-[url('/assets/images/page-title.png')] bg-cover bg-center`}>
        <div>
            <h1 className='text-2xl md:text-4xl font-semibold mb-2 text-center'>
                {props.title}
            </h1>
            <ul className='flex gap-2 justify-center text-black '>
                <li>
                    <Link href={WEBSITE_HOME} className='font-semibold'>Home</Link>
                    </li>
                    {props.links.map((item,index)=>(
                        <li key={index} >
                            <span className='mr-1'>/</span>
                            {item.href ? (
                                <Link className='text-black' href={item.href}>
                                    {item.label}
                                </Link>
                            ):(
                                <span>{item.label}</span>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    </div>
  )
}

export default WebsiteBreadcrumb