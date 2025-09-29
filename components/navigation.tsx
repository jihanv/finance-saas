"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import NavButton from './nav-button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useMedia } from "react-use"
import { Button } from './ui/button';
import { Menu } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";



const routes = [
    {
        href: "/",
        label: "Overview"
    },
    {
        href: "/transactions",
        label: "Transactions"
    },
    {
        href: "/accounts",
        label: "Accounts"
    },
    {
        href: "/categories",
        label: "Categories"
    },
    {
        href: "/settings",
        label: "Settings"
    },

]

export default function Navigation() {

    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const isMobile = useMedia("(max-width: 1024px)", false)
    const pathname = usePathname()

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false)
    }

    if (isMobile) {
        return (
            <Sheet
                open={isOpen}
                onOpenChange={setIsOpen}>

                {/* Need to set this asChild because of the nested button */}
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition">
                        <Menu className='h-4 w-4' />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className='px-2'>
                    <VisuallyHidden><h2>Navigation Menu</h2></VisuallyHidden>
                    <nav className='flex flex-col gap-y-2 pt-6'>
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.href === pathname ? "secondary" : "ghost"}

                                // Use onClick instead of Link, because link will not close the drawer
                                onClick={() => onClick(route.href)}>{route.label}</Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>

        )
    }


    return (
        <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto'>
            {routes.map(route => {
                return (<NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />)
            })}
        </nav>
    )
}

