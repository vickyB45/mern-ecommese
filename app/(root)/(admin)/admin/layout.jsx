'use client'
import AppSidebar from '@/components/Aplication/admin/AppSidebar'
import Topbar from '@/components/Aplication/admin/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from 'next-themes'
import React, { useState, useEffect } from 'react'


const layout = ({ children }) => {
  const [year, setYear] = useState(2025); // fallback to current year
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <ThemeProvider
    attribute="class"
    defaultTheme='system'
    enableSystem
    disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className=' w-full'>
          <div className='min-h-[calc(100vh-40px)] pb-8'>
            <Topbar />
            <div className=' p-2 md:p-4'>
              {children}
            </div>
          </div>
          <div className='border-t w-full h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
            © {year} Developed By Vicky. All Rights Reserved
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default layout