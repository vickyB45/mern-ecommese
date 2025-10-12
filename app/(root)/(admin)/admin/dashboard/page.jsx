import React from 'react'
import CountOverView from "./CountOverView"
import QuickAdd from './QuickAdd'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CardContent } from '@mui/material'
import { OrderOverView } from './OrderOverView'
import { OrderStatus } from './OrderStatus'
import LatestOrder from './LatestOrder'
import LatestReview from './LatestReview'

const AdminDashboard = () => {
  return (
    <div>
      <CountOverView />
      <QuickAdd />

      <div className=' mt-4 md:mt-10 flex lg:flex-nowrap flex-wrap gap-8'>
        <Card  className="rounded-lg lg:w-[70%] w-full p-0">
            <CardHeader className="py-3 border-b-2">
              <div className='flex justify-between items-center'>
                <span className='text-lg'>Order Overview</span>
                <Button type="button">
                  <Link href={''}>
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <OrderOverView />
            </CardContent>
        </Card>
        <Card  className="rounded-lg lg:w-[30%] w-full p-0">
            <CardHeader className="py-3 border-b-2">
              <div className='flex justify-between items-center'>
                <span className=''>Order Status</span>
                <Button type="button">
                  <Link href={''}>
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent >
              <OrderStatus />
            </CardContent>
        </Card>
      </div>
      

      <div className=' mt-4 md:mt-10 flex lg:flex-nowrap flex-wrap gap-8'>
        <Card  className="rounded-lg lg:w-[70%] w-full p-0 block">
            <CardHeader className="py-3 border-b-2">
              <div className='flex justify-between items-center'>
                <span className='text-lg'>Latest Order</span>
                <Button type="button">
                  <Link href={''}>
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className='h-[400px] md:h-[350px] overflow-auto'>
                <LatestOrder />
            </CardContent>
        </Card>
        <Card  className="rounded-lg lg:w-[30%] w-full p-0 block">
            <CardHeader className="py-3 border-b-2">
              <div className='flex justify-between items-center'>
                <span className=''>Latest Review</span>
                <Button type="button">
                  <Link href={''}>
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className='h-[400px] md:h-[350px] overflow-auto' >
              <LatestReview />
            </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default AdminDashboard