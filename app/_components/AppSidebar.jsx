"use client"
import React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '../../components/ui/sidebar'

import Image from "next/image"
import { Compass, GalleryHorizontalEnd, LogIn, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

const MenuOptions = [
    {
        title: "Home",
        icon: Search,
        path: "/",
    },
    {
        title: "Discover",
        icon: Compass,
        path: "/discover",
    },
    {
        title: "Library",
        icon: GalleryHorizontalEnd,
        path: "/library",
    },
    {
        title: "Sign In",
        icon: LogIn,
        path: "/sign-in",
    },
]

function AppSidebar() {
    const path = usePathname();
    const { user } = useUser();

    return (
        <div>
            <Sidebar >
                <SidebarHeader style={{ backgroundColor: "#eff0eb" }} className='flex items-center py-5'>
                    <Image src={'/logo.png'} alt='logo' width={180} height={140} />
                </ SidebarHeader>

                <SidebarContent style={{ backgroundColor: "#eff0eb" }}>
                    <SidebarGroup >
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild
                                        className={`p-5 py-6 hover:bg-transparent hover:font-bold cursor-pointer
                                            ${path?.includes(menu.path) && 'font-bold'}`}>
                                        <a href={menu.path} className=''>
                                            <menu.icon className='h-8 w-8' />
                                            <span className='text-lg'>{menu.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                        {!user ? <SignUpButton mode='modal'>
                            <Button className='rounded-full mx-4 mt-4'>Sign Up</Button>
                        </SignUpButton > :
                            <SignOutButton mode='modal'>
                                <Button className='rounded-full mx-4 mt-4'>Logout</Button>
                            </SignOutButton>}

                    </SidebarGroup>
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter style={{ backgroundColor: "#eff0eb" }}>
                    <div className='p-3 flex flex-col '>
                        <h2 className='text-gray-500' >Try Now</h2>
                        <p className='text-gray-500' >Upgrade for image upload, smarter AI, and more Copilot</p>
                        <Button variant={'secondary'} className={'text-gray-500'} >Learn more</Button>
                        <UserButton />
                    </div>
                </SidebarFooter>
            </Sidebar>
        </div >
    )
}

export default AppSidebar