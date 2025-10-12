
'use client'
import React from 'react'
import { IoMdClose } from "react-icons/io";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import { LuChevronRight } from 'react-icons/lu';

const AppSidebar = () => {

    const {toggleSidebar} = useSidebar()

    return (
        <Sidebar>
            <SidebarHeader className="border-b-1 h-14">
                <div className='flex justify-between items-center px-4'>
                    <Image src='/assets/images/logo-black.png' height={70} width={100} alt='logo' className='block dark:hidden' />
                    <Image src='/assets/images/logo-white.png' height={70} width={100} alt='logo' className='hidden dark:block' />
                    <Button onClick={toggleSidebar} type="button" size="icon" className=" cursor-pointer md:hidden">
                        <IoMdClose />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3">
                <SidebarMenu>
                    {
                        adminAppSidebarMenu.map((menu, index) => (
                            <Collapsible key={index} className="group">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton asChild>
                                            <div className="flex items-center justify-between w-full">
                                                <Link href={menu?.url} className="flex items-center gap-2">
                                                    {menu?.icon}
                                                    <span>{menu?.title}</span>
                                                </Link>

                                                {/* Arrow for submenu */}
                                                {menu.submenu && menu.submenu.length > 0 && (
                                                    <LuChevronRight
                                                        className="ml-2 transition-transform duration-200 data-[state=open]:rotate-90"
                                                    />
                                                )}
                                            </div>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    {/* Submenu */}
                                    {menu.submenu && menu.submenu.length > 0 && (
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {menu.submenu.map((submenuItem, submenuIndex) => (
                                                    <SidebarMenuSubItem key={submenuIndex}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link href={submenuItem.url}>{submenuItem.title}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    )}
                                </SidebarMenuItem>
                            </Collapsible>
                        ))
                    }

                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>

    )
}

export default AppSidebar