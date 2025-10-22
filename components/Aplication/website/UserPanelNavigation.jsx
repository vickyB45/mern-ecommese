'use client'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'
import { USER_DASHBOARD, USER_ORDERS, USER_PROFILE, WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { logout } from '@/store/reducer/authReducer'
import axios from 'axios'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'

const UserPanelNavigation = () => {
    const path = usePathname()

    
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Correct hook

    const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");

      if (!logoutResponse) {
        throw new Error("Logout failed");
      }

      dispatch(logout());
      showToast({ type: "success", message: logoutResponse.message });
      router.push(WEBSITE_LOGIN); // ✅ Works now
    } catch (error) {
      showToast({
        type: "error",
        message: error?.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className='border shadow-sm p-4 rounded'>
        <ul>
            <li className='mb-2'>
                <Link href={USER_DASHBOARD} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${path.startsWith(USER_DASHBOARD) && "bg-primary text-white"}`}>Dashboard</Link>
            </li>
            <li className='mb-2'>
                <Link href={USER_PROFILE} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${path.startsWith(USER_PROFILE) && "bg-primary text-white"}`}>Profile</Link>
            </li>
            <li className='mb-2'>
                <Link href={USER_ORDERS} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${path.startsWith(USER_ORDERS) && "bg-primary text-white"}`}>Orders</Link>
            </li>
            <li className='mb-2'>
                <Button type="button" onClick={()=>handleLogout()} variant="destructive" className="w-full cursor-pointer">Logout</Button>
            </li>
        </ul>
    </div>
  )
}

export default UserPanelNavigation